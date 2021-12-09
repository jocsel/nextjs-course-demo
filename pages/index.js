import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A First Meetup",
//     image:
//       "https://static.anuevayork.com/wp-content/uploads/2018/09/05135024/Que-ver-en-Boston-en-una-excursion-desde-Nueva-York-Beacon-Hill.jpg",
//     address: "Some address 5, 12345 Some city",
//     description: "This is a first meetup",
//   },
//   {
//     id: "m2",
//     title: "A second Meetup",
//     image:
//       "https://static.anuevayork.com/wp-content/uploads/2018/09/05135024/Que-ver-en-Boston-en-una-excursion-desde-Nueva-York-Beacon-Hill.jpg",
//     address: "Some address 5, 12345 Some city",
//     description: "This is a second meetup",
//   },
// ];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name= 'description'
          content= 'Browse a huge list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch data from an API
//   return{
//     props:{
//       meetups: DUMMY_MEETUPS,
//     },

//   };
// }
//EN LA RENDERIZACION JS BUSCA PRIMERO EJECUTAR ESTA FUNCION EL NOMBRE DE LA FUNCION ES ESE
//POR CONVENCION, ES UN FUNCTION ASYNC HASTA Q SE RESUELVA VA A DEVOLVER EL VALOR
//TAMBIEN PUEDES EJECUTAR CUALQUIER CODIGO QUE SE EJECUTA DEL LADO DEL SERVIDOR
export async function getStaticProps() {
  //fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://jocsel:jocsel@cluster0.2crxo.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetups) => ({
        title: meetups.title,
        address: meetups.address,
        image: meetups.image,
        id: meetups._id.toString(),
      })),
    },
    revalidate: 1,
  };
}
export default HomePage;
