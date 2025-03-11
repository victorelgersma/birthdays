import { useEffect, useState } from 'react';
import { getOrdinalSuffix, months } from '../lib/constants';

interface Birthday {
  month: number;
  day: number;
  year?: number;
}

type BirthdayMap = {
  [name: string]: Birthday;
}

export function BirthdayList() {
  const [birthdays, setBirthdays] = useState<BirthdayMap>({});

  useEffect(() => {
    const stored = localStorage.getItem('birthdays');
    if (stored) {
      setBirthdays(JSON.parse(stored));
    }
  }, []);

  const handleDelete = (name: string) => {
    if (confirm('Are you sure you want to delete this birthday?')) {
      const newBirthdays = { ...birthdays };
      delete newBirthdays[name];
      localStorage.setItem('birthdays', JSON.stringify(newBirthdays));
      setBirthdays(newBirthdays);
    }
  };

  // Sort entries for display
  const sortedEntries = Object.entries(birthdays)
    .sort(([, a], [, b]) => {
      if (a.month === b.month) {
        return a.day - b.day;
      }
      return a.month - b.month;
    });

  return (
    <div className="min-w-full">
      <table className="min-w-full">
        <tbody>
          {sortedEntries.map(([name, { month, day }]) => (
            <tr key={name} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-gray-600">
                {months[month]} {getOrdinalSuffix(day)}
              </td>
              <td className="py-2 px-4 font-medium">{name}</td>
              <td className="py-2 px-2 text-right">
                <button
                  onClick={() => handleDelete(name)}
                  className="text-red-600 size-12 hover:text-red-800"
                >
                  <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
