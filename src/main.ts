import { createApp } from "vue";
import "./assets/style.scss";
import App from "./App.vue";
import router from "./router";
import { useAuth } from "./composables/useAuth";
import { supabase } from "./config/supabase";

const app = createApp(App);

supabase.auth.getUser().then(({ data }) => {
  const { setUser } = useAuth();
  if (data?.user) {
    setUser(data.user);
  }
});

app.use(router);
app.mount("#app");
