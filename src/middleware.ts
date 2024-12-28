// export { auth as middleware } from "@/auth"

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default auth(async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const headers = new Headers()
    headers.set('x-pathname', pathname)

    return NextResponse.next({
        headers,
    })

})