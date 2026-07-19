import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutOrder, setCheckoutOrder] = useState(null); // Holds details for modal
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState('');

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      const plansRes = await axiosInstance.get('/subscriptions/plans');
      setPlans(plansRes.data?.data || []);

      const subRes = await axiosInstance.get('/subscriptions');
      setSubscription(subRes.data?.data?.subscription || null);
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const handleUpgrade = async (planId) => {
    setMessage('');
    try {
      const res = await axiosInstance.post('/payments/checkout', { planId });
      setCheckoutOrder(res.data?.data || null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to initialize checkout.');
    }
  };

  const handleConfirmMockPayment = async (status) => {
    if (!checkoutOrder) return;
    setPaying(true);
    try {
      if (status === 'success') {
        const payload = {
          razorpay_order_id: checkoutOrder.id,
          razorpay_payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
          razorpay_signature: 'mock_signature_hash',
          method: 'card',
        };

        const res = await axiosInstance.post('/payments/verify', payload);
        setMessage(res.data?.message || 'Payment successfully processed!');
        loadSubscriptionData();
      } else {
        setMessage('Payment verification cancelled.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed.');
    } finally {
      setPaying(false);
      setCheckoutOrder(null);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-neutral-500 font-medium">Loading subscription packages...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-heading text-gradient">Choose Your Plan 💎</h1>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Upgrade to unlock premium features and connect with more matches.
        </p>
      </div>

      {subscription && (
        <div className="bg-primary-50/55 border border-primary-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-neutral-800">
              Active Tier: <span className="capitalize text-primary-700 font-extrabold">{subscription.planId?.name || 'Free'}</span>
            </h4>
            <p className="text-xs text-neutral-500">
              Expires on: {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 capitalize">
            {subscription.status}
          </span>
        </div>
      )}

      {message && (
        <div className="p-4 bg-primary-50 border border-primary-100 text-primary-800 text-sm font-medium rounded-xl">
          {message}
        </div>
      )}

      {/* Plans catalog cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = subscription?.planId?._id === p._id;
          return (
            <div key={p._id} className={`bg-white rounded-3xl border p-6 flex flex-col justify-between space-y-6 ${
              isCurrent ? 'border-primary-600 shadow-md ring-2 ring-primary-50' : 'border-neutral-100 shadow-sm'
            }`}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-neutral-800 capitalize">{p.name}</h3>
                  <span className="text-2xl font-bold font-heading text-neutral-800">₹{p.price}</span>
                  <span className="text-xs text-neutral-400"> / {p.durationDays} days</span>
                </div>
                <ul className="text-xs text-neutral-500 space-y-2.5">
                  <li className="flex items-center gap-2">✓ Daily Invites Limit: {p.features?.interestsPerDay === -1 ? 'Unlimited' : p.features?.interestsPerDay}</li>
                  <li className="flex items-center gap-2">✓ Shortlist Limit: {p.features?.maxShortlist === -1 ? 'Unlimited' : p.features?.maxShortlist}</li>
                  <li className="flex items-center gap-2">✓ Chat Permissions: {p.features?.canChat ? 'Yes' : 'No'}</li>
                  <li className="flex items-center gap-2">✓ View Contacts: {p.features?.canViewContact ? 'Yes' : 'No'}</li>
                </ul>
              </div>

              <button
                onClick={() => handleUpgrade(p._id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl font-bold text-xs capitalize ${
                  isCurrent ? 'bg-neutral-100 text-neutral-400' : 'btn-primary'
                }`}
              >
                {isCurrent ? 'Current Tier' : 'Upgrade Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Simulated Checkout Modal */}
      {checkoutOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl animate-fade-in border">
            <div className="text-center space-y-2">
              <div className="text-4xl">💳</div>
              <h3 className="text-lg font-bold font-heading text-neutral-800">Matrimony Sandboxed Gateway</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We have initialized a sandbox payment. Select one option below to verify signature processing.
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-xl border text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-medium text-neutral-700">{checkoutOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Price:</span>
                <span className="font-bold text-neutral-700">₹{checkoutOrder.amount / 100}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleConfirmMockPayment('success')}
                disabled={paying}
                className="btn-primary text-xs py-2.5 rounded-xl flex-1 font-bold"
              >
                {paying ? 'Processing...' : 'Confirm Success'}
              </button>
              <button
                onClick={() => handleConfirmMockPayment('cancel')}
                disabled={paying}
                className="btn-ghost text-xs py-2.5 border rounded-xl flex-1 font-bold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
