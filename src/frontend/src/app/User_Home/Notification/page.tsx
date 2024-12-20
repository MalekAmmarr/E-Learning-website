// pages/notification.tsx
'use client';
import React from 'react';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
export interface User {
  email: string;
  name: string;
  age: string;
  passwordHash: string;
  profilePictureUrl?: string;
  appliedCourses: string[];
  acceptedCourses: string[];
  courseScores: { courseTitle: string; score: number }[];
  Notifiction: string[];
  feedback: Array<{
    quizId: string;
    courseTitle: string;
    feedback: Array<{ question: string; feedback: string }>;
  }>;
  Notes: string[];
  GPA: number;
}

const Notification: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Single user object
  const router = useRouter();
  const fetchUserDetails = async (
    email: string,
    accessToken: string,
  ): Promise<User> => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/getUser/${email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Assuming Bearer token is used for authorization
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data: User = await response.json();
      console.log('Fetched user details:', data); // Debugging: Log the fetched user details
      setUser(data); // Update state with user data
      return data; // Return the fetched user data
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error; // Propagate the error for the caller to handle
    }
  };

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem('userData');
      const accessToken = sessionStorage.getItem('authToken');
      if (userData) {
        if (accessToken) {
          const parsedData: User = JSON.parse(userData); // Parse the single user object
          fetchUserDetails(parsedData.email, accessToken);
        } else router.push('/login');
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(
        'Failed to retrieve or parse user data from localStorage',
        err,
      );
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />{' '}
      {/* displays site properly based on user's device */}
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/assets/images/favicon-32x32.png"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/dist/styles.css" />
      <title>Notifications page</title>
      {/* Feel free to remove these styles or customise in your own stylesheet 👍 */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n    .attribution { font-size: 11px; text-align: center; }\n    .attribution a { color: hsl(228, 45%, 44%); }\n  ',
        }}
      />
      <div className="container notifications-container shadow">
        <div className="row header">
          <div className="col-7">
            <p className="title">
              Notifications
              <span className="unread-notifications-number">
                {user?.Notifiction.length}
              </span>
            </p>
          </div>
          <div className="col-5 mark-as-read text-end">
            <a
              href="#"
              id="markAllAsRead"
              className="mark-as-read-button align-middle"
            >
              Mark all as read
            </a>
          </div>
        </div>
        <div className="row notifications">
          <div className="col-12">
            {user?.Notifiction.slice()
              .reverse()
              .map((notification, index) => (
                <div key={index} className="row single-notification-box unread">
                  <div className="col-1 profile-picture">
                    <img
                      src={
                        notification.split(' ')[0] === 'Congratulations!'
                          ? '/assets/images/Congratulation.jpg' // Image for "Congratulations"
                          : '/assets/images/Rejected.jpg' // Image for other notifications
                      }
                      alt="profile picture"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-11 notification-text">
                    <p>
                      <a
                        className={`link ${
                          notification?.split(' ')[0].toLowerCase() ===
                          'Congratulations!'
                            ? 'name'
                            : ''
                        }`}
                      >
                        {notification?.split(' ')[0]}
                      </a>
                      <span className="description">
                        {notification.split(' ').slice(1, 8).join(' ')}
                      </span>
                      <a className="link">
                        {notification.split(' ').slice(8, 11).join(' ')}
                      </a>
                      <span className="description">
                        {notification.split(' ').slice(11).join(' ')}
                      </span>
                      <span className="unread-symbol">•</span>
                    </p>
                    <p className="time">Just now</p>
                  </div>
                </div>
              ))}
          </div>

          {/* <div className="row single-notification-box unread">
              <div className="col-1 profile-picture">
                <img
                  src="/assets/images/avatar-angela-gray.webp"
                  alt="profile picture"
                  className="img-fluid"
                />
              </div>
              <div className="col-11 notification-text">
                <p>
                  <a href="#" className="link name">
                    Angela Gray{' '}
                  </a>
                  <span className="description">followed you</span>
                  <span className="unread-symbol">•</span>
                </p>
                <p className="time">5m ago</p>
              </div>
            </div> */}
          {/* <div className="row single-notification-box unread">
              <div className="col-1 profile-picture">
                <img
                  src="/assets/images/avatar-jacob-thompson.webp"
                  alt="profile picture"
                  className="img-fluid"
                />
              </div>
              <div className="col-11 notification-text">
                <p>
                  <a href="#" className="link name">
                    Jacob Thompsoapan
                  </a>
                  <span className="description">has joined your group</span>
                  <a className="link group" href="http://">
                    Chess Club
                  </a>
                  <span className="unread-symbol">•</span>
                </p>
                <p className="time">1 day ago</p>
              </div>
            </div> */}
          {/* <div className="row single-notification-box read">
            <div className="col-1 profile-picture">
              <img
                src="/assets/images/avatar-rizky-hasanuddin.webp"
                alt="profile picture"
                className="img-fluid"
              />
            </div>
            <div className="col-11 notification-text">
              <p>
                <a href="#" className="link name">
                  Rizky Hasanuda
                </a>
                <span className="description">sent you a private message</span>
                <span className="unread-symbol">•</span>
              </p>
              <p className="time">5 days ago</p>
              <div className="private-message">
                Hello, thanks for setting up the Chess Club. I've been a member
                for a few weeks now and I'm already having lots of fun and
                improving my game.
              </div>
            </div>
          </div>
          <div className="row single-notification-box unread">
            <div className="col-1 profile-picture">
              <img
                src="/assets/images/avatar-mark-webber.webp"
                alt="profile picture"
                className="img-fluid"
              />
            </div>
            <div className="col-11 notification-text">
              <p>
                <a href="#" className="link name">
                  Mark Webber
                </a>
                <span className="description">reacted to your recent post</span>
                <a className="link" href="http://">
                  My first tournament today!
                </a>
                <span className="unread-symbol">•</span>
              </p>
              <p className="time">1m ago</p>
            </div>
          </div> */}
          {/* <div className="row single-notification-box read">
              <div className="col-1 profile-picture">
                <img
                  src="/assets/images/avatar-kimberly-smith.webp"
                  alt="profile picture"
                  className="img-fluid"
                />
              </div>
              <div className="col-10 notification-text comment">
                <p>
                  <a href="#" className="link name">
                    Kimberly Smita
                  </a>
                  <span className="description">commented on your picture</span>
                  <span className="unread-symbol">•</span>
                </p>
                <p className="time">1 week ago</p>
              </div>
              <div className="col-1 profile-picture clickable-image">
                <img
                  src="/assets/images/image-chess.webp"
                  alt="profile picture"
                  className="img-fluid"
                />
              </div>
            </div> */}
          {/* <div className="row single-notification-box read">
              <div className="col-1 profile-picture">
                <img
                  src="/assets/images/avatar-nathan-peterson.webp"
                  alt="profile picture"
                  className="img-fluid"
                />
              </div>
              <div className="col-11 notification-text">
                <p>
                  <a href="#" className="link name">
                    Nathan Petersa
                  </a>
                  <span className="description">
                    reacted to your recent post
                  </span>
                  <a className="link" href="http://">
                    5 end-game strategies to increase your win rate
                  </a>
                  <span className="unread-symbol">•</span>
                </p>
                <p className="time">2 weeks ago</p>
              </div>
            </div> */}
          {/* <div className="row single-notification-box read">
              <div className="col-1 profile-picture">
                <img
                  src="/assets/images/avatar-anna-kim.webp"
                  alt="profile picture"
                  className="img-fluid"
                />
              </div>
              <div className="col-11 notification-text">
                <p>
                  <a href="#" className="link name">
                    Anna Kim
                  </a>
                  <span className="description">left the group</span>
                  <a className="link" href="http://">
                    Chess Club
                  </a>
                  <span className="unread-symbol">•</span>
                </p>
                <p className="time">2 weeks ago</p>
              </div>
            </div> */}
        </div>
      </div>
      {/*
      
    
    */}
      <div className="attribution">
        Coded by <a href="#">Chadi Koberssy</a>.
      </div>
      {/* Add jQuery */}
      <Script
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"
        strategy="afterInteractive" // Load after the page is interactive
      />
      {/* Add Bootstrap JS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Add your custom unread.js script */}
      <Script src="/App/js/unread.js" strategy="afterInteractive" />
    </>
  );
};

export default Notification;
