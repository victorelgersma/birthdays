import { pb } from '../../utils/pocketbase';

export async function GET() {
    if (!pb.authStore.isValid) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    try {
        const records = await pb.collection('birthdays').getFullList({
            sort: 'birthday',
        });
        return new Response(JSON.stringify(records), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response('Error fetching birthdays', { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!pb.authStore.isValid) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const data = await request.json();
        const record = await pb.collection('birthdays').create({
            name: data.name,
            birthday: data.birthday,
            user: pb.authStore.model?.id
        });
        return new Response(JSON.stringify(record), { 
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response('Error creating birthday', { status: 500 });
    }
}