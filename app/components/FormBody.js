import React, { useState } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';

const FormBody = ({rating, name, comment,email, title,setRating,setName,setComment, setEmail, setTitle}) => {
  

 
 
  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <div >
      
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Nom et prénom
        </label>
        <input
          type="text"
          className="border border-gray-300  p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="text"
          className="border border-gray-300  p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">Note</label>
        <div className="flex items-center text-lg">
          {[1, 2, 3, 4, 5].map((star) =>
            star <= rating ? (
              <BsStarFill
                key={star}
                className="text-yellow-500 cursor-pointer"
                onClick={() => handleRatingChange(star)}
              />
            ) : (
              <BsStar
                key={star}
                className="text-gray-300 cursor-pointer"
                onClick={() => handleRatingChange(star)}
              />
            )
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Titre
        </label>
        <input
          type="text"
          className="border border-gray-300  p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Votre avis
        </label>
        <textarea
          className="border border-gray-300  p-2 w-full"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>
      
    </div>
  );
};

export default FormBody;


















// import React, { useState } from 'react';
// import { FaSmileWink } from 'react-icons/fa';
// import { BsStar, BsStarFill } from 'react-icons/bs';
// import {Form} from '@remix-run/react';

// const rates = [
//   {
//     rating: 1,
//     text: 'Poor',
//     question: 'Why was your experience so bad?',
//     color: 'text-red-600',
//   },
//   {
//     rating: 2,
//     text: 'Too bad',
//     question: 'Why was your experience so bad?',
//     color: 'text-orange-600',
//   },
//   {
//     rating: 3,
//     text: 'Average quality',
//     question: 'Why was your average rating experience?',
//     color: 'text-yellow-500',
//   },
//   {
//     rating: 4,
//     text: 'Nice',
//     question: 'Why was your experience good?',
//     color: 'text-green-500',
//   },
//   {
//     rating: 5,
//     text: 'Very good quality',
//     question: 'Give a compliment!',
//     color: 'text-green-900',
//     icon: <FaSmileWink className="inline" />,
//   },
// ];

// const ReviewForm = (props) => {
//   const [rating, setRating] = useState(0);
//   const [field, setField] = useState({ name: '', comment: ''});


//   const clickOnStar = (selectedRating) => {
//     setRating(selectedRating);
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setField({ ...field, [name]: value });
//   };

//   return (
//     <div className="review-form flex-1 content-padding block-margin-top p-4 flex flex-col justify-center items-center">
//       <p>How was your experience about our product?</p>
//       <Form  method="post">
//         {props.validation && (
//           <div className="flex items-center justify-center mb-6 bg-zinc-500">
//             <p className="m-4 text-sm text-contrast">{props.validation}</p>
//           </div>
//         )}
//         <div className="ratings-component flex flex-col justify-center items-center">
//           {rating > 0 && (
//             <p
//               className={`apreciation mb-2.5 ${rates[rating - 1].color}`}
//             >
//               {rates[rating - 1].text}
//             </p>
//           )}
//           <StarRating rating={rating} onChange={clickOnStar} />
//           {rating > 0 && (
//             <p className="question mb-2.5">{rates[rating - 1].question}</p>
//           )}
//           {rating > 0 && rates[rating - 1].icon && (
//             <div className="icon mb-2.5">{rates[rating - 1].icon}</div>
//           )}
//         </div>

//         <input type="hidden" id="rating" name="rating" value={rating} />
//         <input
//             id="name"
//           className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           type="text"
//           value={field.name}
//           name="name"
//           placeholder="Name"
//           onChange={handleInputChange}
//         />
//         <textarea
//           id="comment"
//           rows="4"
//           className="px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
//           placeholder="Write a comment..."
//           required
//           onChange={handleInputChange}
//           value={field.comment}
//         />

//         <button className="bg-primary text-contrast rounded py-2 px-4 focus:shadow-outline block w-full">
//           Post a review
//         </button>
//       </Form>

      
//     </div>
//   );
// };

// const StarRating = ({ rating, onChange }) => {
//   const stars = [1, 2, 3, 4, 5];

//   const clickOnStar = (selectedRating) => {
//     onChange(selectedRating);
//   };

//   return (
//     <div className="ratingo flex text-primary">
//       {stars.map((star) => (
//         <span
//           key={star}
//           className="cursor-pointer"
//           onClick={() => clickOnStar(star)}
//         >
//           {rating < star ? (
//             <BsStar className="text-primary" />
//           ) : (
//             <BsStarFill className="text-primary" />
//           )}
//         </span>
//       ))}
//     </div>
//   );
// };

// export default ReviewForm;
