import React from "react";

export default function About() {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <h1
        style={{ textShadow: "2px 2px 4px #AF6DCD" }}
        className="text-[#437cb2] text-3xl font-semibold text-center my-7"
      >
        About Mercatus Immobilis Novatorum
      </h1>
      <p className="mb-4 text-slate-700">
        Mercatus Immobilis Novatorum, a leading real estate agency, specializes
        in assisting clients with buying, selling, and renting properties in
        prime locations.
      </p>
      <p className="mb-4 text-slate-700">
        Our mission is to help our clients achieve their real estate goals by
        providing expert advice, personalized service, and a deep understanding
        of the local market. Whether you are looking to buy, sell, or rent a
        property, we are here to help you every step of the way.
      </p>
      <p className="mb-4 text-slate-700">
        With a team of experienced professionals, we offer unparalleled
        expertise and personalized assistance to ensure our clients' needs are
        met with precision and care.
      </p>
    </div>
  );
}
