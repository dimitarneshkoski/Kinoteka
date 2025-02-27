import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import ReservationDetail from "../components/ReservationDetail";
import { projectFirestore } from "../firebase/config";
import { getUID } from "../util/auth";
import { tailChase } from "ldrs";

function ReservationDetailPage() {
  const { reservation } = useLoaderData();
  tailChase.register();

  return (
    <Suspense
      fallback={
        <p
          style={{
            textAlign: "center",
            marginTop: "15rem",
          }}
        >
          <l-tail-chase
            size="75"
            speed="2"
            color="var(--color-third)"
          ></l-tail-chase>
        </p>
      }
    >
      {" "}
      <Await resolve={reservation}>
        {(loadedReservation) => (
          <ReservationDetail reservation={loadedReservation} />
        )}
      </Await>
    </Suspense>
  );
}

export default ReservationDetailPage;

export async function loadReservationFirebase(uid, reservationId) {
  let reservationFromDb;
  await projectFirestore
    .collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const allReservationsForUser = doc.data();
        reservationFromDb = allReservationsForUser.reservations.find(
          (res) => res.id === reservationId
        );
      }
    });

  return reservationFromDb;
}

export function loader({ params }) {
  const reservationId = params.reservationId;
  const uid = getUID();

  return defer({
    reservation: loadReservationFirebase(uid, reservationId),
  });
}
