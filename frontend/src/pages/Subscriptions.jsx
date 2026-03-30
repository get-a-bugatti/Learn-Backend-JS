import { useEffect, useState } from "react"
import axios from "axios";
import {useSelector} from "react-redux";
import SubscriptionCard from "../components/SubscriptionCard";


export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null)
    const userData = useSelector(state => state.auth.userData);

    useEffect(() => {

        axios.get(`/api/v1/users/c/${userData.username}/subscription`)
            .then(response => {
                console.log(response.data.data);

                setSubscriptions(response.data.data);
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.message.data);
                } else {
                    setError(error.message)
                }
            })
            .finally(() => {
                setLoader(false);
            })
    }, [])

    if (loader) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className="space-y-4 ">
            {   
                subscriptions.map((subscription) => {
                    return <SubscriptionCard 
                        channel={subscription}
                    />
                })
            }
        </div>
    )
}