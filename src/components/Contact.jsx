import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { AlchemyBookCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Jad",
          from_email: form.email,
          to_email: "YOUR_EMAIL_HERE",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I’ll get back to you as soon as I can.");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert("Something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="w-full overflow-x-clip">
      <div className="grid gap-10 xl:grid-cols-[460px_1fr] items-start">
        {/* LEFT: CONTACT CARD */}
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="min-w-0 bg-black-100/90 p-8 rounded-2xl border border-white/5"
        >
          <p className={styles.sectionSubText}>Get in touch</p>
          <h3 className={styles.sectionHeadText}>Contact.</h3>

          {/* CV buttons (CV.pdf in /public) */}
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="bg-tertiary py-2.5 px-4 rounded-xl text-white font-medium border border-white/10 hover:border-white/20 transition"
            >
              View CV
            </a>

            <a
              href="/CV.pdf"
              download="CV.pdf"
              className="bg-tertiary py-2.5 px-4 rounded-xl text-white font-medium border border-white/10 hover:border-white/20 transition"
            >
              Download CV
            </a>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-7"
          >
            <label className="flex flex-col">
              <span className="text-white font-medium mb-3">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-3">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your email"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-3">Message</span>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What would you like to say?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium resize-none"
              />
            </label>

            <button
              type="submit"
              className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </motion.div>

        {/* RIGHT: BOOK STAGE */}
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="min-w-0 relative rounded-2xl border border-white/5 bg-black/10 overflow-hidden"
        >
          {/* stage height */}
          <div className="h-[420px] md:h-[560px] xl:h-[680px]">
            <AlchemyBookCanvas />
          </div>

          {/* subtle vignette (optional, makes it feel intentional) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
