import { API_ENDPOINTS } from "@/server/contants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const helpers = new Headers();
        helpers.append('Content-Type', 'application/json');

        const url = `${API_ENDPOINTS.API_URL}${API_ENDPOINTS.LOGIN_URL}`;


        const response = await fetch(url, {
            method: 'POST',
            headers: helpers,
            body: JSON.stringify(body)
        });

        if(!response.ok) {
            return NextResponse.json({ message: 'Error fetching data from external API' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching data from external API' }, { status: 500 });
    }
}