import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const email = localStorage.getItem("customerEmail");

      if (!email) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      // Get all notifications
      const response = await api.get(
        `/notifications/user/${encodeURIComponent(email)}`
      );

      console.log(
        "Notifications response:",
        response.data
      );

      setNotifications(response.data);

      // Get unread notifications
      const unreadResponse = await api.get(
        `/notifications/user/${encodeURIComponent(email)}/unread`
      );

      console.log(
        "Unread notifications:",
        unreadResponse.data
      );

      setUnreadCount(
        unreadResponse.data.length
      );

    } catch (err) {
      console.error(
        "Notification error:",
        err
      );

      if (err.response?.data?.errors) {
        setError(
          err.response.data.errors[0]?.msg ||
            "Unable to load notifications."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load notifications."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {

      const response = await api.patch(
        `/notifications/user/${notificationId}/read`
      );

      console.log(
        "Notification marked as read:",
        response.data
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                status: "Read",
              }
            : notification
        )
      );

      setUnreadCount((previous) =>
        Math.max(0, previous - 1)
      );

    } catch (err) {

      console.error(
        "Mark notification error:",
        err
      );

    }
  };


  if (loading) {
    return (
      <div className="notifications-page">
        <h2>Loading notifications...</h2>
      </div>
    );
  }


  if (error) {
    return (
      <div className="notifications-page">

        <h1>Notifications</h1>

        <p className="notification-error">
          {error}
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </div>
    );
  }


  const customerEmail =
    localStorage.getItem("customerEmail");


  if (!customerEmail) {
    return (
      <div className="notifications-page">

        <h1>Notifications</h1>

        <div className="empty-notifications">

          <h3>
            No customer information found
          </h3>

          <p>
            Place an order first to receive
            notifications.
          </p>

          <button
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>

          <h1>
            Notifications
          </h1>

          <p>
            {customerEmail}
          </p>

        </div>


        {unreadCount > 0 && (
          <span className="unread-count">
            {unreadCount} unread
          </span>
        )}

      </div>


      {notifications.length === 0 ? (

        <div className="empty-notifications">

          <h3>
            No notifications
          </h3>

          <p>
            You don't have any notifications
            yet.
          </p>

        </div>

      ) : (

        <div className="notifications-list">

          {notifications.map(
            (notification) => (

              <div
                key={notification._id}
                className={`notification-card ${
                  notification.status === "Unread"
                    ? "notification-unread"
                    : ""
                }`}
              >

                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      Order Completed 🎉
                    </h3>


                    {notification.status ===
                      "Unread" && (
                      <span className="unread-badge">
                        Unread
                      </span>
                    )}

                  </div>


                  <p>
                    {notification.message}
                  </p>


                  <p className="notification-order">

                    <strong>
                      Order ID:
                    </strong>{" "}

                    {notification.orderId}

                  </p>


                  <p className="notification-customer">

                    <strong>
                      Customer:
                    </strong>{" "}

                    {notification.customerName}

                  </p>


                  {notification.createdAt && (
                    <small>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </small>
                  )}

                </div>


                <div className="notification-actions">

                  <button
                    onClick={() =>
                      navigate(
                        `/order/${notification.orderId}`
                      )
                    }
                  >
                    View Order
                  </button>


                  {notification.status ===
                    "Unread" && (

                    <button
                      className="mark-read-button"
                      onClick={() =>
                        handleMarkAsRead(
                          notification._id
                        )
                      }
                    >
                      Mark as Read
                    </button>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Notifications;