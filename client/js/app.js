const agentForm =
  document.getElementById(
    "agentForm"
  );

const agentInput =
  document.getElementById(
    "agentInput"
  );

const promptChips =
  document.querySelectorAll(
    ".prompt-chip"
  );

const navLinks =
  document.querySelectorAll(
    ".sidebar-nav .nav-link"
  );


/* =================================
   SIDEBAR NAVIGATION
================================= */

function setActiveNav(activeLink) {

  navLinks.forEach(
    (link) => {
      link.classList.remove(
        "active"
      );
    }
  );

  activeLink.classList.add(
    "active"
  );

}


navLinks.forEach(
  (link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute(
            "href"
          );

        if (
          !targetId ||
          !targetId.startsWith("#")
        ) {
          return;
        }

        const targetSection =
          document.querySelector(
            targetId
          );

        if (!targetSection) {
          return;
        }

        event.preventDefault();

        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        history.replaceState(
          null,
          "",
          targetId
        );

        setActiveNav(
          link
        );

      }
    );

  }
);


const observedSections = [
  "dashboard",
  "analyst",
  "markets",
  "reports",
  "about"
]
  .map(
    (id) =>
      document.getElementById(id)
  )
  .filter(Boolean);


if (
  "IntersectionObserver" in window
) {

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        const visibleEntry =
          entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            )[0];

        if (!visibleEntry) {
          return;
        }

        const matchingLink =
          document.querySelector(
            `.sidebar-nav .nav-link[href="#${visibleEntry.target.id}"]`
          );

        if (matchingLink) {
          setActiveNav(
            matchingLink
          );
        }

      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75]
      }
    );

  observedSections.forEach(
    (section) => {
      sectionObserver.observe(
        section
      );
    }
  );

}


/* =================================
   PROMPT CHIPS
================================= */

promptChips.forEach(
  (chip) => {

    chip.addEventListener(
      "click",
      () => {

        agentInput.value =
          chip.textContent.trim();

        agentInput.focus();

        agentForm.requestSubmit();

      }
    );

  }
);


/* =================================
   AGENT FORM
================================= */

agentForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const query =
      agentInput.value.trim();


    if (!query) {

      agentInput.focus();

      return;

    }


    const analyzeButton =
      agentForm.querySelector(
        "button[type='submit']"
      );


    analyzeButton.disabled =
      true;

    analyzeButton.textContent =
      "Analyzing...";


    resetWorkflow();

    setAgentStatus(
      "Working"
    );


    try {

      /* STEP 1 */

      setWorkflowStep(
        0,
        "active"
      );

      await delay(450);

      setWorkflowStep(
        0,
        "complete"
      );


      /* STEP 2 */

      setWorkflowStep(
        1,
        "active"
      );


      const reportPromise =
        runMarketAgent(
          query
        );


      await delay(650);

      setWorkflowStep(
        1,
        "complete"
      );


      /* STEP 3 */

      setWorkflowStep(
        2,
        "active"
      );

      await delay(550);

      setWorkflowStep(
        2,
        "complete"
      );


      /* STEP 4 */

      setWorkflowStep(
        3,
        "active"
      );


      const report =
        await reportPromise;


      await delay(400);


      renderReport(
        report
      );


      setWorkflowStep(
        3,
        "complete"
      );


      setAgentStatus(
        "Complete"
      );


    } catch (error) {

      console.error(
        "Agent error:",
        error
      );


      showAgentError(
        error.message
      );


      setAgentStatus(
        "Error"
      );


    } finally {

      analyzeButton.disabled =
        false;

      analyzeButton.textContent =
        "Analyze";

    }

  }
);


/* =================================
   MARKET DATA
================================= */

async function loadMarkets() {

  try {

    const markets =
      await fetchMarkets();


    markets.forEach(
      (market) => {

        updateMarketCard(
          market
        );

      }
    );


  } catch (error) {

    console.error(
      "Market data error:",
      error
    );


    showMarketError();

  }

}


/* =================================
   INITIAL LOAD
================================= */

loadMarkets();


/* =================================
   AUTO REFRESH
================================= */

setInterval(
  loadMarkets,
  60000
);