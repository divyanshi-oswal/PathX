import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const apparelData = await request.json();
        const dataFilePath = path.join(process.cwd(), 'src/app/api/apparel/apparel.json');

        // Write the apparel data to the JSON file
        await fs.writeFile(dataFilePath, JSON.stringify(apparelData, null, 2), 'utf-8');

        return NextResponse.json({ message: 'Apparel data updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error updating apparel data:", error);
        return NextResponse.json({ message: 'Error updating apparel data' }, { status: 500 });
    }
}

