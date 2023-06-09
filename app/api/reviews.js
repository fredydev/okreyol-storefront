// api/reviews.js

const API_ENDPOINT = 'https://8jxa28c4bj.execute-api.eu-west-3.amazonaws.com';

// Fetch all reviews for a specific product
export const getAllReviewsForProduct = async (productId) => {
  const response = await fetch(`${API_ENDPOINT}/reviews/${productId}`);
  const data = await response.json();
  return data;
};

// Create a new review
export const createReview = async (reviewData) => {
  const response = await fetch(`${API_ENDPOINT}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  const data = await response.json();
  return data;
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  const response = await fetch(`${API_ENDPOINT}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  const data = await response.json();
  return data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_ENDPOINT}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};
