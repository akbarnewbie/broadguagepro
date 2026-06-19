import { motion } from "framer-motion";

const trains = [
  { no: "12627", name: "Broad Gauge Express", from: "Chennai", to: "New Delhi", departs: "18:05", platform: "3", status: "On Time", statusType: "ontime" as const },
  { no: "11041", name: "Konkan Coastal", from: "Mumbai", to: "Mangalore", departs: "18:45", platform: "5", status: "Delayed 12m", statusType: "delay" as const },
  { no: "22639", name: "Vande Bharat BG", from: "Chennai", to: "Bengaluru", departs: "19:10", platform: "1", status: "Boarding", statusType: "boarding" as const },
];

const statusColors = {
  ontime: "bg-emerald-500/20 text-emerald-300",
  delay: "bg-red-400/20 text-red-300",
  boarding: "bg-sky/20 text-sky",
};

const TrainBoardsSection = () => {
  return (
    <section id="trainboards" className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">TrainBoards</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
            Station boards that feel alive
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Recreate the charm of classic and modern Indian railway station boards with pixel-perfect layouts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Board Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-lg"
          >
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-3 mb-1">
              <span>BGPro Junction</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
                Live Departures
              </span>
            </div>

            {/* Header row */}
            <div className="grid grid-cols-7 gap-2 py-2 text-[0.65rem] uppercase tracking-wider text-muted-foreground border-b border-border">
              <span>No.</span>
              <span className="col-span-1">Train</span>
              <span>From</span>
              <span>To</span>
              <span>Departs</span>
              <span>Pltf</span>
              <span>Status</span>
            </div>

            {/* Data rows */}
            {trains.map((train, i) => (
              <motion.div
                key={train.no}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="grid grid-cols-7 gap-2 py-2.5 text-sm border-b border-border/50 text-foreground"
              >
                <span className="text-muted-foreground font-mono text-xs">{train.no}</span>
                <span className="col-span-1 font-medium truncate text-xs">{train.name}</span>
                <span className="text-xs">{train.from}</span>
                <span className="text-xs">{train.to}</span>
                <span className="font-mono text-xs">{train.departs}</span>
                <span className="text-center text-xs">{train.platform}</span>
                <span className={`text-[0.65rem] px-2 py-0.5 rounded-full text-center ${statusColors[train.statusType]}`}>
                  {train.status}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Designed for streamers & creators
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Plug TrainBoards into your stream overlay, control room, or personal setup. Fully configurable with presets inspired by real stations across India.
            </p>
            <ul className="space-y-2 mb-6">
              {["Classic flip-dot and LED styles", "Overlay-friendly transparent modes", "Data from in-sim or custom sources"].map((f) => (
                <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="inline-flex items-center px-5 py-2.5 rounded-full border border-border text-foreground text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Talk to us about TrainBoards
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrainBoardsSection;
