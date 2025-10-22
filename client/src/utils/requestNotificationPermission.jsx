import React, { useState } from "react";

export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        new Notification("Notifications enabled!", {
            body: "You'll now receive Life Planner reminders.",
        });
    } else if (permission === "denied"){
        alert ("You denied notifications. You can enable them in your browser settings");
    }
}