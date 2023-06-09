import {Link} from '~/components';

export function AccountDetails({customer}) {
  const {firstName, lastName, email, phone} = customer;

  return (
    <>
      <div className="grid w-full gap-4  pb-6 md:gap-8 md:pb-8 lg:pb-12 ">
        <h3 className="font-bold text-lead">Détails du compte</h3>
        <div className="lg:p-8 p-6 border border-gray-200 rounded">
          <div className="flex">
            <h3 className="font-bold text-base flex-1">Profile & Sécurité</h3>
            <Link
              prefetch="intent"
              className="underline text-sm font-normal"
              to="/account/edit"
            >
              Modifier
            </Link>
          </div>
          <div className="mt-4 text-sm text-primary/50">Nom</div>
          <p className="mt-1">
            {firstName || lastName
              ? (firstName ? firstName + ' ' : '') + lastName
              : 'Ajouter nom'}{' '}
          </p>

          <div className="mt-4 text-sm text-primary/50">Contact</div>
          <p className="mt-1">{phone ?? 'Ajouter Téléphone'}</p>

          <div className="mt-4 text-sm text-primary/50">Address Email</div>
          <p className="mt-1">{email}</p>

          <div className="mt-4 text-sm text-primary/50">Mot de passe</div>
          <p className="mt-1">**************</p>
        </div>
      </div>
    </>
  );
}
