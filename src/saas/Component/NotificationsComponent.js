import { initializeApp } from "firebase/app";
import { getMessaging, getToken,onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBuN2CqtKzrAZzTVJ_dOTfsupxrbf_Z3_c",
  authDomain: "hr-management-a1a12.firebaseapp.com",
  projectId: "hr-management-a1a12",
  storageBucket: "hr-management-a1a12.appspot.com",
  messagingSenderId: "1080422304488",
  appId: "1:1080422304488:web:2de4d10b4708fb4031d75d",
  measurementId: "G-ZC9JTZR22T",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const generateToke = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const registration = await navigator.serviceWorker.ready;
      // const token = await getToken(messaging, {
      //   vapidKey:
      //     "BMhyzrhtLwkNqK7MF6bg_4nK2MMpNmV1VD0zROpiusKxZdGzScOopCJEFLDDee6SF3v2kMZgHQX4AOOi39ZGgyY",
      // });
      const token = await getToken(messaging, {
        vapidKey:
          "BMhyzrhtLwkNqK7MF6bg_4nK2MMpNmV1VD0zROpiusKxZdGzScOopCJEFLDDee6SF3v2kMZgHQX4AOOi39ZGgyY",
        serviceWorkerRegistration: registration,
      });

      if (token) {
        sessionStorage.setItem("fcmToken", token);
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};
export const onForegroundMessage = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);

    // Handle notification display or other logic here
    alert(`New Notification: ${payload.notification?.title}`);
  });
};