import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { serviceGroups, industries, processSteps } from "@/data/content";
import { getIcon } from "@/lib/icons";

export function ServicesSection() {
  return (
    <section className="bg-ink py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading align="center" eyebrow="خدمات ما" title="راهکارهای جامع رشد" description="ما مجموعه‌ای از خدمات را ارائه می‌دهیم که مانند چرخ‌دنده‌های یک ساعت، با هم کار می‌کنند." />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {serviceGroups.map((group, i) => {
            const Icon = getIcon(group.icon);
            return (
              <Reveal key={group.id} delay={i * 0.1}>
                <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-accent/50 hover:bg-white/10">
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{group.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{group.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section className="bg-ink py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading align="center" eyebrow="صنایع" title="تجربه در صنایع مختلف" description="ما راهکارهای خود را با نیازهای خاص هر صنعت تطبیق می‌دهیم." />
        </Reveal>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {industries.map((ind, i) => {
            const Icon = getIcon(ind.icon);
            return (
              <Reveal key={ind.label} delay={i * 0.05}>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white/80 transition-colors hover:border-accent/50 hover:text-white">
                  <Icon className="size-5 text-accent" />
                  <span className="text-sm font-medium">{ind.label}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="bg-ink py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading align="center" eyebrow="فرایند کار" title="مسیر رشد شما" description="ما با یک نقشه راه شفاف و گام‌به‌گام، کسب‌وکار شما را به سطح بعدی می‌بریم." />
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-5">
          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <div className="relative text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-xl font-black text-white shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}