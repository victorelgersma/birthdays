import { useEffect, useState } from 'react'
import { getOrdinalSuffix, months } from '../lib/constants'

interface Birthday {
  month: number
  day: number
  year?: number
}

type BirthdayMap = {
  [name: string]: Birthday
}

// Group birthdays by month
type GroupedBirthdays = {
  [month: number]: Array<{ name: string; day: number }>
}

export function BirthdayList() {
  const [birthdays, setBirthdays] = useState<BirthdayMap>({})

  useEffect(() => {
    const stored = localStorage.getItem('birthdays')
    if (stored) {
      setBirthdays(JSON.parse(stored))
    }
  }, [])

  const handleDelete = (name: string) => {
    if (confirm('Are you sure you want to delete this birthday?')) {
      const newBirthdays = { ...birthdays }
      delete newBirthdays[name]
      localStorage.setItem('birthdays', JSON.stringify(newBirthdays))
      setBirthdays(newBirthdays)
    }
  }

  // Group birthdays by month
  const groupedBirthdays: GroupedBirthdays = {}

  Object.entries(birthdays).forEach(([name, { month, day }]) => {
    if (!groupedBirthdays[month]) {
      groupedBirthdays[month] = []
    }
    groupedBirthdays[month].push({ name, day })
  })

  // Sort each month's birthdays by day
  Object.values(groupedBirthdays).forEach((daysArray) => {
    daysArray.sort((a, b) => a.day - b.day)
  })

  // Get current month (1-12)
  const currentMonth = new Date().getMonth() + 1 // JavaScript months are 0-indexed

  return (
    <div className="min-w-full">
      {Object.entries(groupedBirthdays)
        .sort(([monthA], [monthB]) => parseInt(monthA) - parseInt(monthB))
        .map(([month, daysArray]) => {
          const monthNum = parseInt(month)
          const isCurrentMonth = monthNum === currentMonth

          return (
            <div
              key={month}
              className={`mb-6 ${
                isCurrentMonth
                  ? 'border-l-4 border-blue-500 pl-2 rounded-l'
                  : ''
              }`}
            >
              <h2
                className={`${
                  isCurrentMonth
                    ? 'text-2xl font-bold text-blue-700'
                    : 'text-xl font-bold text-gray-700'
                } border-b pb-1 mb-2`}
              >
                {months[monthNum]}
              </h2>
              <dl className="pl-4">
                {daysArray.map(({ name, day }) => (
                  <div
                    key={name}
                    className={`
                      flex items-center py-2 rounded
                      ${
                        isCurrentMonth ? 'hover:bg-blue-50' : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <dt className="w-16 text-gray-600 font-medium">
                      {getOrdinalSuffix(day)}
                    </dt>
                    <dd className="flex-grow">{name}</dd>
                    <button
                      onClick={() => handleDelete(name)}
                      className="text-red-600 size-10 hover:text-red-800"
                      aria-label={`Delete ${name}'s birthday`}
                    >
                      <svg
                        className="size-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}

      {Object.keys(groupedBirthdays).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No birthdays added yet. Add your first one!
        </div>
      )}
    </div>
  )
}
