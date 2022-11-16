import { useEffect, useState } from "react"
import Stomp from "stompjs"
import SockJs from "sockjs-client"

export const useStompClient = (subscribeCallback, currentUser) => {
  const [stompClient, setStompClient] = useState()

  useEffect(() => {
    connect()
  }, [])

  const connect = () => {
    const sockJs = new SockJs("https://localhost:443/ws")
    let client = Stomp.over(sockJs)
    client.connect({}, () => client.subscribe("/user/" + currentUser.id + "/queue/messages", subscribeCallback), onError)
    setStompClient(client)
  }

  const onError = err => {
    console.log(err)
  }

  return stompClient
}
