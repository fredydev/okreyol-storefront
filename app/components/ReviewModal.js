import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import FormBody from './FormBody'
import { createReview } from '~/api/reviews';
import { Button } from './Button';

export default function ReviewModal({open, handleOpen, productId}) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const handleSubmit = () => {
    const shopifyPrefix = 'gid://shopify/Product/'
    const id = productId.split(shopifyPrefix)[1]
    const data = {
      productId: id,
      reviewRate: rating,
      reviewerName: name,
      reviewerEmail: email,
      reviewTitle: title,
      reviewContent: comment
    }
    const response = createReview(data)
    console.log('response : '+response)
    setComment('')
    setEmail('')
    setTitle('')
    setName('')
    setRating(0)
    handleOpen(false)
    
  }
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={()=>handleOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <form >
                    <div className="mt-3  sm:mt-5 mb-4">
                      <Dialog.Title as="h3" className=" text-lg font-semibold leading-6 text-gray-900 mb-2">
                        Laissez-nous un commentaire
                      </Dialog.Title>
                      <Dialog.Description className={"mb-6"}>
                        Dites-nous ce que vous pensez de notre produit
                      </Dialog.Description>
                      <div className="mt-2">
                        <FormBody
                          comment={comment}
                          setComment={setComment}
                          email={email}
                          setEmail={setEmail}
                          name={name}
                          setName={setName}
                          rating={rating}
                          setRating={setRating}
                          setTitle={setTitle}
                          title={title}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className=""
                      >
                        Poster
                      </Button>
                      <Button
                        type="button"
                        className="border border-gray-300 bg-transparent  py-2 px-4"
                        onClick={() => handleOpen(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}











// import { Fragment, useRef } from 'react'
// import { Dialog, Transition } from '@headlessui/react'
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
// import ReviewForm from './ReviewForm'

// export default function Modal({open, handleOpen}) {

//   const cancelButtonRef = useRef(null)

//   return (
//     <Transition.Root show={open} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed z-10 inset-0 overflow-y-auto"
//           initialFocus={cancelButtonRef}
//           onClose={handleOpen}
//         >
//           <div className="flex items-center justify-center min-h-screen p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
//             </Transition.Child>

//             <span
//               className="hidden sm:inline-block sm:align-middle sm:h-screen"
//               aria-hidden="true"
//             >
//               &#8203;
//             </span>

//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="sm:flex sm:items-start">
//                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
//                       <ExclamationTriangleIcon
//                         className="h-6 w-6 text-yellow-600"
//                         aria-hidden="true"
//                       />
//                     </div>
//                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                       <Dialog.Title
//                         as="h3"
//                         className="text-lg leading-6 font-medium text-gray-900"
//                       >
//                         Laissez-nous un commentaire
//                       </Dialog.Title>
//                       <Dialog.Description>
//                       Dites-nous ce que vous pensez de notre produit
//                       </Dialog.Description>
//                       <div className="mt-2">
//                         <ReviewForm/>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="button"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark sm:ml-3 sm:w-auto sm:text-sm"
//                     onClick={handleOpen}
//                     ref={cancelButtonRef}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition.Root>
//   )
// }
