// import React, { useState } from "react";
// import { io } from "socket.io-client";

// const SERVER_URL = "http://localhost:3001"; // ⚠️ Change to production URL

// let socket;

// export default function App() {
//   const [proId, setProId] = useState(""); // Pro _id
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [logs, setLogs] = useState([]);
//   const [connected, setConnected] = useState(false);

//   const log = (msg) =>
//     setLogs((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev]);

//   const connectSocket = () => {
//     socket = io(SERVER_URL, {
//       transports: ["websocket"],
//       reconnectionAttempts: 5,
//     });

//     socket.on("connect", () => {
//       log(`✅ Connected (${socket.id})`);
//       setConnected(true);
//     });

//     socket.on("disconnect", () => {
//       log("❌ Disconnected");
//       setConnected(false);
//     });

//     socket.on("updateSuccess", (data) => {
//       log(`📍 Location updated: ${JSON.stringify(data)}`);
//     });

//     socket.on("updateFailed", (data) => {
//       log(`❌ Update failed: ${data.error}`);
//     });

//     socket.on("proLocation", (data) => {
//       if (data.error) {
//         log(`❌ Error: ${data.error}`);
//       } else {
//         log(`📦 Pro Location: ${JSON.stringify(data)}`);
//       }
//     });

//     socket.on("connect_error", (err) => {
//       log(`❗ Connection error: ${err.message}`);
//     });
//   };

//   const sendLocationUpdate = () => {
//     if (!proId || !latitude || !longitude) {
//       return alert("Enter Pro ID, latitude, and longitude!");
//     }
//     socket.emit("updateLocation", {
//       _id: proId.trim(),
//       latitude,
//       longitude,
//       locationName: "Updated from Frontend",
//     });
//     log("📤 Sent location update");
//   };

//   const fetchProLocation = () => {
//     if (!proId) return alert("Enter Pro ID to fetch!");
//     socket.emit("getProLocation", { _id: proId.trim() });
//     log("🔍 Requested Pro location");
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto space-y-4 text-gray-800">
//       <h1 className="text-2xl font-bold text-center">📡 Pro Location Manager</h1>

//       <div className="space-y-2">
//         <input
//           type="text"
//           className="border p-2 w-full rounded"
//           placeholder="Enter Pro ID"
//           value={proId}
//           onChange={(e) => setProId(e.target.value)}
//         />
//         {!connected && (
//           <button
//             onClick={connectSocket}
//             className="w-full bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Connect
//           </button>
//         )}
//       </div>

//       {connected && (
//         <>
//           <div className="space-y-2">
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="text"
//                 className="border p-2 rounded"
//                 placeholder="Latitude"
//                 value={latitude}
//                 onChange={(e) => setLatitude(e.target.value)}
//               />
//               <input
//                 type="text"
//                 className="border p-2 rounded"
//                 placeholder="Longitude"
//                 value={longitude}
//                 onChange={(e) => setLongitude(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={sendLocationUpdate}
//               className="w-full bg-green-600 text-white px-4 py-2 rounded"
//             >
//               Update Location
//             </button>
//           </div>

//           <div>
//             <button
//               onClick={fetchProLocation}
//               className="w-full bg-purple-600 text-white px-4 py-2 rounded mt-2"
//             >
//               Get Pro Location
//             </button>
//           </div>
//         </>
//       )}

//       <div className="bg-gray-100 p-3 rounded h-64 overflow-auto text-sm mt-4">
//         {logs.length === 0 && <p className="text-gray-400">No logs yet...</p>}
//         {logs.map((logItem, index) => (
//           <div key={index} className="mb-1">
//             {logItem}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { io } from "socket.io-client";

// 🌐 Dynamic backend URL
const SERVER_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3001" // Local backend
    : "https://predemo.site/Gardening"; // Live backend

let socket;

export default function App() {
  const [proId, setProId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);

  const log = (msg) =>
    setLogs((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev]);

  const connectSocket = () => {
    if (socket) return log("⚠️ Already connected");

    socket = io(SERVER_URL, {
      transports: ["websocket"], // 🚀 Force websocket only
      reconnection: true,        // Auto reconnect
      reconnectionAttempts: 10,  // Retry 10 times
      reconnectionDelay: 2000,   // 2s delay between retries
      secure: SERVER_URL.startsWith("https"), // Required for HTTPS backend
      withCredentials: true,     // For secure cookies (future proof)
    });

    socket.on("connect", () => {
      log(`✅ Connected (${socket.id})`);
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      log(`❌ Disconnected (${reason})`);
      setConnected(false);
    });

    socket.on("updateSuccess", (data) => {
      log(`📍 Location updated: ${JSON.stringify(data)}`);
    });

    socket.on("updateFailed", (data) => {
      log(`❌ Update failed: ${data.error}`);
    });

    socket.on("proLocation", (data) => {
      if (data.error) {
        log(`❌ Error: ${data.error}`);
      } else {
        log(`📦 Pro Location: ${JSON.stringify(data)}`);
      }
    });

    socket.on("connect_error", (err) => {
      log(`❗ Connection error: ${err.message}`);
    });
  };

  const sendLocationUpdate = () => {
    if (!proId || !latitude || !longitude) {
      return alert("Enter Pro ID, latitude, and longitude!");
    }
    socket.emit("updateLocation", {
      _id: proId.trim(),
      latitude,
      longitude,
      locationName: "Updated from Frontend",
    });
    log("📤 Sent location update");
  };

  const fetchProLocation = () => {
    if (!proId) return alert("Enter Pro ID to fetch!");
    socket.emit("getProLocation", { _id: proId.trim() });
    log("🔍 Requested Pro location");
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 text-gray-800">
      <h1 className="text-2xl font-bold text-center">📡 Pro Location Manager</h1>

      <div className="space-y-2">
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Enter Pro ID"
          value={proId}
          onChange={(e) => setProId(e.target.value)}
        />
        {!connected && (
          <button
            onClick={connectSocket}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
          >
            Connect
          </button>
        )}
      </div>

      {connected && (
        <>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
            <button
              onClick={sendLocationUpdate}
              className="w-full bg-green-600 text-white px-4 py-2 rounded"
            >
              Update Location
            </button>
          </div>

          <div>
            <button
              onClick={fetchProLocation}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded mt-2"
            >
              Get Pro Location
            </button>
          </div>
        </>
      )}

      <div className="bg-gray-100 p-3 rounded h-64 overflow-auto text-sm mt-4">
        {logs.length === 0 && <p className="text-gray-400">No logs yet...</p>}
        {logs.map((logItem, index) => (
          <div key={index} className="mb-1">
            {logItem}
          </div>
        ))}
      </div>
    </div>
  );
}

