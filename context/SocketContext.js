import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../config';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';

// Create the Socket Context
const SocketContext = createContext();

// Hook to use the Socket Context
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // Use useRef to persist socket connection across re-renders
  const socketRef = useRef(null);

  // Orders state to hold the list of orders
  const [orders, setOrders] = useState([]);
  const [incomingDeliveries, setincomingDeliveries] = useState([])
  const [currentDeliveries, setCurrentDeliveries] = useState([]); // New state for accepted orders

  useEffect(() => {
    // Initialize socket connection only if it's not already established
    if (!socketRef.current) {
      socketRef.current = io("ws://192.168.98.47:1245", {
        transports: ['websocket'],
      });
    }

    // Handle socket connection
    socketRef.current.on('connect', async () => {
      console.log('Socket connected with id:', socketRef.current.id);

      // Register the user on connection
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const { id, email } = decodedToken;

      socketRef.current.emit("register_user", {
        user_id: id,
        user_type: "driver",
        email: email,
      });
    });

    // Handle incoming order
    socketRef.current.on('new_order', (latestOrder) => {
      console.log('New incoming order:', latestOrder);

      // Update orders state to include the latest order
      setincomingDeliveries((prevOrders) => [latestOrder, ...prevOrders]);
      Vibration.vibrate(2000)
    });

    // Handle socket disconnection
    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on("ignore_booking", (data) => {
      const { order_id } = data;
      console.log(`Order ${order_id} ignored and removed`);
      setincomingDeliveries((prevOrders) => prevOrders.filter(order => order.order_id !== order_id));
    });

    // Remove accepted bookings
    socketRef.current.on("booking_accepted", (data) => {
      const { order_id } = data;
      console.log(`Order ${order_id} accepted and moved to current deliveries`);

      setincomingDeliveries((prevOrders) => {
        const acceptedOrder = prevOrders.find(order => order.order_id === order_id);
        if (acceptedOrder) {
          setCurrentDeliveries((prevDeliveries) => [acceptedOrder, ...prevDeliveries]);
        }
        return prevOrders.filter(order => order.order_id !== order_id);
      });
    });

    // Cleanup on component unmount (e.g., when navigating away)
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Socket disconnected on cleanup');
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, orders, incomingDeliveries, setincomingDeliveries, currentDeliveries }}>
      {children}
    </SocketContext.Provider>
  );
};
