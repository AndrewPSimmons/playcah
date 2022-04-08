//Import View Components
import HomeView from "../views/HomeView"
import JoinRoomView from "../views/JoinRoomView"
import NotFoundView from "../views/NotFoundView"
import RoomView from "../views/RoomView"
function buildRoute(path: string, comp: any, label: string = "", inNav: boolean = true){
    return {path: path, component: comp, label: label, inNav: inNav}
}
const routes = [
    buildRoute("*", NotFoundView),
    buildRoute("/", HomeView),
    buildRoute("/room", RoomView),
    buildRoute("/join/:roomCode", JoinRoomView)
]

export default routes