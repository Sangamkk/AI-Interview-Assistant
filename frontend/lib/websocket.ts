import { Client } from "@stomp/stompjs";

let client: Client | null = null;
let connected = false;

export function connectWebSocket(
    onMessage: (message: string) => void
) {

    client = new Client({

        brokerURL: "ws://localhost:8080/ws",

        reconnectDelay: 5000,

        onConnect: () => {

            console.log("WebSocket connected");

            connected = true;

            client?.subscribe(
                "/topic/interview",
                (message) => {

                    onMessage(message.body);

                }
            );
        },
        onDisconnect: () => {

            console.log(
                "WebSocket disconnected"
            );
            connected = false;
        },

        onStompError: (frame) => {

            console.error(
                "WebSocket error:",
                frame.headers["message"]
            );
        }
    });

    client.activate();
}

export function sendInterviewMessage(
    type: string,
    data: Record<string, string>
) {

    if (!client || !connected) {
        console.log("WebSocket is not connected yet");
        return;
    }

    client.publish({

        destination: "/app/interview",

        body: JSON.stringify({
            type,
            ...data
        })

    });
}


export function disconnectWebSocket() {

    client?.deactivate();

    client = null;
}