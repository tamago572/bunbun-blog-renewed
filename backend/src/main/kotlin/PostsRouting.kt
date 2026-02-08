package dev.bunbunapp

import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.postsRouting() {
    route("/posts") {
        get {
            call.respondText("posts list")
        }
        post {
            call.respondText("posted post")
        }
        delete("/{id}") {
            call.respondText("deleted post :id")
        }
        patch("/{id}") {
            call.respondText("patched post :id")
        }
    }
}