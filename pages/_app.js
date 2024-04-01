import useSupabase from '../utils/useSupabase';

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

function MyApp({ Component, pageProps }) {
  const supabase = useSupabase;
  return (
    <Component supabase = { supabase } {...pageProps} />
  );
}

export default MyApp
