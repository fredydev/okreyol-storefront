import { StarIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { useState } from 'react'
import Modal from './ReviewModal'


const getRandomColor = () => {
  const randomRed = Math.floor(Math.random() * 256);
  const randomGreen = Math.floor(Math.random() * 256);
  const randomBlue = Math.floor(Math.random() * 256);
  return `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`;
};

const CustomerReviews = ({reviews, productId, reviewTotalCount, reviewAverage}) => {
  const [open, setOpen] = useState(false)
  
  
  
  const countData = [
    { rating: 5, count: 0 },
    { rating: 4, count: 0 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ]
  reviewTotalCount ? reviews.map((rev,idx)=>{
    const rate = rev.reviewRate
    for(let i=0;i<5;i++){
      if(countData[i].rating===rate){
        countData[i].count+=1
        return
      }
    }
  }) : null
  const handleOpen = (state) => {
    console.log("Open", state)
    setOpen(state)
  }
  if(reviews.length<=0)return (
    <div className="bg-gray-100 p-8">
      <p>Aucun avis pour l'instant! Soyez le premier.</p>
      <button
                  id="toggle"
                  className={open ? 'button hidden' : ' w-fit mt-6   border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 '}
                  onClick={()=>handleOpen(true)}
                >
                  Rédiger un avis
                </button>

                <Modal open={open} handleOpen={handleOpen} productId={productId}/>
    </div>
  )
  return (
    <section aria-labelledby="reviews-heading" className="bg-white">
          <div className=" py-24 lg:grid  lg:grid-cols-12 lg:gap-x-8 lg:py-32 ">
            <div className="lg:col-span-4">
              <h2 id="reviews-heading" className="text-2xl font-bold tracking-tight text-gray-900">
                Customer Reviews
              </h2>

              <div className="mt-3 flex items-center">
                <div>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => ( 
                      <StarIcon
                        key={rating}
                        className={classNames(
                          reviewAverage > rating ? 'text-yellow-400' : 'text-gray-300',
                          'flex-shrink-0 h-5 w-5'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{reviewAverage} out of 5 stars</p>
                </div>
                <p className="ml-2 text-sm text-gray-900">Based on {reviewTotalCount} reviews</p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Review data</h3>
                <dl className="space-y-3">
                  {countData.map((count) => (
                    <div key={count.rating} className="flex items-center text-sm">
                      <dt className="flex flex-1 items-center">
                        <p className="w-3 font-medium text-gray-900">
                          {count.rating}
                          <span className="sr-only"> star reviews</span>
                        </p>
                        <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                          <StarIcon
                            className={classNames(
                              count.count > 0 ? 'text-yellow-400' : 'text-gray-300',
                              'h-5 w-5 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />

                          <div className="relative ml-3 flex-1">
                            <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                            {count.count > 0 ? (
                              <div
                                className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                style={{ width: `calc(${count.count} / ${reviewTotalCount} * 100%)` }}
                              />
                            ) : null}
                          </div>
                        </div>
                      </dt>
                      <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                        {Math.round((count.count / reviewTotalCount) * 100)}%
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Share your thoughts</h3>
                <p className="mt-1 text-sm text-gray-600">
                  If you’ve used this product, share your thoughts with other customers
                </p>
                <button
                  id="toggle"
                  className={open ? 'button hidden' : 'mt-6 inline-flex w-full items-center justify-center border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full'}
                  onClick={()=>handleOpen(true)}
                >
                  Write review
                </button>

                <Modal open={open} handleOpen={handleOpen} productId={productId} />
              </div>
            </div>

            <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <h3 className="sr-only">Recent reviews</h3>

              <div className="flow-root">
                <div className="-my-12 divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <div key={review.reviewId} className="py-12">
                      <div className="flex items-center">
                      {review.avatarSrc ? (
                        <img
                          src={review.avatarSrc}
                          alt={`${review.reviewerName}.`}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-700" style={{ backgroundColor: getRandomColor() }}>
                          <span className="text-xl font-bold text-white">
                            {review.reviewerName.charAt(0)}
                          </span>
                        </div>
                      )}
                        <div className="ml-4">
                          <h4 className="text-sm font-bold text-gray-900">{review.reviewerName}</h4>
                          <div className="mt-1 flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <StarIcon
                                key={rating}
                                className={classNames(
                                  review.reviewRate > rating ? 'text-yellow-400' : 'text-gray-300',
                                  'h-5 w-5 flex-shrink-0'
                                )}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <p className="sr-only">{review.reviewRate} out of 5 stars</p>
                        </div>
                      </div>

                      <div
                        className="mt-4 space-y-6 text-base italic text-gray-600"
                        dangerouslySetInnerHTML={{ __html: review.reviewContent }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
  )
}

export default CustomerReviews