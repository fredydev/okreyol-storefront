

 

export default function Policies() {

  return (
    <>
      <section
        padding="all"
        display="flex"
        className="flex-col items-baseline w-full gap-8 md:flex-row"
      >
        <div
          heading={"policy.title"}
          className="grid items-start flex-grow gap-4 md:sticky top-36 md:w-5/12"
        >
          <button
            className="justify-self-start"
            variant="inline"
            to={'/policies'}
          >
            &larr; Back to Policies
          </button>
        </div>
        <div className="flex-grow w-full md:w-7/12">
          <div
            dangerouslySetInnerHTML={{__html: "policy.body"}}
            className="prose dark:prose-invert"
          />
        </div>
      </section>
    </>
  );
}

