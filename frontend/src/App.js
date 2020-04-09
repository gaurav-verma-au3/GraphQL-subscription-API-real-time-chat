import React, { useState } from "react";
import "./App.css";
import { Provider, Client, defaultExchanges, subscriptionExchange } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
const subscriptionClient = new SubscriptionClient("ws://localhost:4000", {
  reconnect: true,
});

const client = new Client({
  url: "http://localhost:4000",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});
const App = () => {
  const [user, setUser] = useState(null);
  return (
    <Provider value={client}>
      <div className="App">
        {!user ? <Login setUser={setUser} /> : <ChatRoom user={user} />}
      </div>
    </Provider>
  );
};

export default App;
