import { useEffect, useState } from "react";
import "./App.css";
import ItemList from "./components/ItemList";
import DeliveredItems from "./components/Delivereditems";
import Nav from "./components/Nav";
import type { userOrders } from "./types";
import { Button } from "../components/ui/button";
import { authClient } from "./authclient";

function Dashboard() {

  const [orders, setOrders] = useState<userOrders[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders`)
      const data = await response.json()
      setOrders(data)
      console.log(data)
    } catch (e) {
      throw Error("Could not get user orders from server")
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleProcessEmails = async () => {
    try {
      setIsProcessing(true)
      setProcessingMessage(null)
      
      // get the user id
      const session = await authClient.getSession()
      if (!session?.data?.user?.id) {
        setProcessingMessage("Error: Not authenticated")
        return
      }

      // post request to process email shipments
      const response = await fetch('/api/shipments/ingest/gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.data.user.id,
          period: 5 // look back 5 days
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process emails')
      }

      const result = await response.json()
      console.log('Email processing result:', result)
      
      setProcessingMessage(`${result.successes?.length || 0} order emails processed`)
      
      await fetchOrders()
      
    } catch (error) {
      console.error('Error processing emails:', error)
      setProcessingMessage('Error processing emails. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // filter upcoming orders
  const upcomingOrders = orders.filter(order => !order.actualDeliveryDate);

  // filter delivered orders
  const deliveredOrders = orders.filter(order => order.actualDeliveryDate);

  console.log("dashboard has orders", orders)
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center m-auto w-[60%]">
        <p className="text-4xl font-bold border-b-1 border-gray-300 w-full p-10">Your Orders</p>

        <div className="text-2xl w-full mt-10 flex flex-col items-start gap-5">
          <div className="w-full flex justify-between items-center">
            <p className="font-extrabold">Upcoming deliveries</p>
            <div className="flex flex-col items-end gap-2">
              <Button 
                onClick={handleProcessEmails}
                disabled={isProcessing}
                variant="outline"
                size="sm"
              >
                {isProcessing ? 'Processing...' : 'Process Orders'}
              </Button>
              {processingMessage && (
                <p className={`text-sm ${processingMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {processingMessage}
                </p>
              )}
            </div>
          </div>
          {upcomingOrders.map((order) => <ItemList key={order.id} order={order} />)}
        </div>

        <div className="text-2xl w-full mt-10 flex flex-col items-start gap-5">
          <p className="font-extrabold ">Delivery history</p>
          {deliveredOrders.map((order) => <DeliveredItems key={order.id} order={order} />)}
        </div>
      </div>

    </>
  );
}

export default Dashboard;
