import React , { useEffect, useState } from "react";
import './style.css';

const UrlPage = () => {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [collectionData, setCollectionData] = useState([]);

  const fetchAnalyticsData = async (shortId) => {
    try {
      const analyticsResponse = await fetch(`http://localhost:8000/url/analytics/${shortId}`);
      const analyticsData = await analyticsResponse.json();
      return analyticsData.totalclicks; 
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return 0; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/url/shortID`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: redirectUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const showData = data.backenData;

      const clicks = await fetchAnalyticsData(showData.shortId);

      const updatedData = {
        originalLink: showData.originalLink,
        shortId: showData.shortId,
        clicks: clicks || 0,
        date: new Date().toLocaleDateString(),
      };

      setCollectionData((prevData) => [...prevData, updatedData]);
      setRedirectUrl(""); // Clear input field after submission
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const updateClicks = async () => {
      const updatedCollectionData = await Promise.all(
        collectionData.map(async (url) => {
          const clicks = await fetchAnalyticsData(url.shortId);
          return { ...url, clicks: clicks || 0 };
        })
      );
      setCollectionData(updatedCollectionData);
    };

    if (collectionData.length > 0) {
      const interval = setInterval(updateClicks, 10000); // Update clicks every 10 seconds
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [collectionData]); 

  return (
    <>
      <div className="container">
        <h1>Shorten Your Links</h1>
        <div className="form-section">
          <form onSubmit={handleSubmit}>
          
            <input
              type="text"
              name="input"
              placeholder="   Enter the link here :)"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
            />
           
            <button type="submit">Generate</button>
          </form>
        </div>

        {collectionData.length > 0 && (
          <div className="form-data">
            <table>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Short Link</th>
                  <th>Original Link</th>
                  <th>Clicks</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {collectionData.map((url, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <a
                        href={`http://localhost:8000/url/${url.shortId}`}
                        target="_blank" rel="noreferrer"
                      >
                        {url.shortId}
                      </a>
                    </td>
                    <td>{url.originalLink}</td>
                    <td>{url.clicks}</td>
                    <td>{url.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UrlPage;
