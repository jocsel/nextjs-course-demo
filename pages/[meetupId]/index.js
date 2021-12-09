import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props){
    return(
      <Fragment>
        <Head>
          <title>{props.meetupData.title}</title>
          <meta
            name='description'
            content= {props.meetupData.description}
          />
        </Head>
        <MeetupDetail
            image= {props.meetupData.image}
            title= {props.meetupData.title}
            address= {props.meetupData.address}
            description= {props.meetupData.description}
        />
      </Fragment>       
    );
}
export async function getStaticPaths(){

  const client = await MongoClient.connect(
    'mongodb+srv://jocsel:jocsel@cluster0.2crxo.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();
  client.close();
  return{
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}
export async function getStaticProps(context){
    //fetch data for a single meetup
    const meetupId = context.params.meetupId;
    console.log('meetupId', meetupId);
    const client = await MongoClient.connect(
      'mongodb+srv://jocsel:jocsel@cluster0.2crxo.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();
  
    const meetupsCollection = db.collection('meetups');
    const selectMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId),
    });
    console.log('selectMeetup', selectMeetup);

    client.close();
    return{
        props:{
            meetupData: {
              id: selectMeetup._id.toString(),
              title: selectMeetup.title,
              description: selectMeetup.description,
              address: selectMeetup.address,
              image: selectMeetup.image,
            },
        },
    };
}

export default MeetupDetails;