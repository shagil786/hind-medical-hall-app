import { API_ENDPOINTS } from "@/server/contants";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const helpers = new Headers();
        helpers.append('Content-Type', 'application/json');

        const url = `${API_ENDPOINTS.API_URL}${API_ENDPOINTS.OFFERS_URL}`;


        const response = await fetch(url, {
            method: 'GET',
            headers: helpers
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