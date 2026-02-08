package dev.bunbunapp

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {

    install(IgnoreTrailingSlash)

    routing {
        postsRouting()

        get("/") {
            call.respondText("Hello World!")
        }
    }
}
