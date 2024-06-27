import React, { useState, useEffect } from "react";
import styles from "../Stripe.module.scss";
import { ExpirationAlertWithCallback } from "../../../utils/alerts.js";

const CountdownTimer = ({ tid }) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 10,
    seconds: 0,
  });

  useEffect(() => {
    // Definimos decrementTimer dentro de useEffect para acceder a timerId
    const decrementTimer = () => {
      setTimeLeft((prevTime) => {
        let updatedMinutes = prevTime.minutes;
        let updatedSeconds = prevTime.seconds - 1;

        if (updatedSeconds < 0) {
          if (updatedMinutes === 0) {
            clearInterval(timerId);
            handleTimerEnd();
            return ExpirationAlertWithCallback(
              "error",
              "Tiempo expirado",
              "Se ha acabado el tiempo para realizar su compra.",
              () => window.location.replace(`http://localhost:8080/products`)
            );
          } else {
            updatedMinutes -= 1;
            updatedSeconds = 59; // reiniciar los segundos y decrementar los minutos
          }
        }
        return { minutes: updatedMinutes, seconds: updatedSeconds };
      });
    };

    const timerId = setInterval(decrementTimer, 1000);

    return () => clearInterval(timerId); // Limpieza para evitar fugas de memoria
  }, []);

  const handleTimerEnd = async () => {
    try {
      await fetch(`http://localhost:8080/api/carts/delete-ticket/${tid}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  return (
    <div className="d-flex">
      <p className="me-2 my-auto">Tiempo para completar la compra.</p>
      <div className="bg-opacity-8 border rounded me-2 d-flex aligne-items-center">
        <p className={styles.countdown}>
          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}:
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
