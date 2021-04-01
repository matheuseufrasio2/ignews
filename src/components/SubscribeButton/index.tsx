import { useSession, signIn } from 'next-auth/client';
import { Session } from 'next-auth';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';
import { useRouter } from 'next/dist/client/router';

interface SubscribeButtonProps {
  priceId: string;
}

interface SessionProps extends Session {
  activeSubscription?: unknown;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();
  const sessionEdited: SessionProps = session;

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (sessionEdited.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post('subscribe');

      const { sessionId } = response.data;

      const stripe = getStripeJs();

      (await stripe).redirectToCheckout({ sessionId });

    } catch (err) {
      alert(err.message)
    }
  }
  
  return (
    <button
      className={styles.subscribeButton}
      type="button"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}