import { SampleCourseMaterial } from '../types/quiz';

export const SAMPLE_MATERIALS: SampleCourseMaterial[] = [
  {
    id: 'nmc-water-studies',
    title: 'NMC WSI 100: Great Lakes Limnology & Freshwater Watersheds',
    subject: 'NMC Water Studies',
    suggestedQuestions: 8,
    sourceText: `Northwestern Michigan College - Great Lakes Water Studies Institute (WSI 100)
Course Summary: Grand Traverse Bay Limnology, Freshwater Ecosystems, and Watershed Management

1. Grand Traverse Bay & Lake Michigan Physical Limnology
Grand Traverse Bay is a deep, oligotrophic arm of Lake Michigan situated in northern Lower Michigan. The bay is divided into East Bay and West Bay by the Old Mission Peninsula. Because of its great depth (exceeding 600 feet in parts of East Bay) and cold hypolimnion, it exhibits seasonal thermal stratification:
- Epilimnion: The warmer, low-density upper layer of water in summer, well-mixed by wind action.
- Thermocline (Metalimnion): The transition layer characterized by a rapid drop in water temperature with increasing depth.
- Hypolimnion: The cold, dense bottom layer remaining near 4°C throughout the summer stratification period.
During spring and autumn, lake overturn occurs when uniform water density allows wind-driven mixing of dissolved oxygen and nutrients throughout the entire water column.

2. Nutrient Dynamics and Trophic State
- Oligotrophic Indicators: Grand Traverse Bay is characterized by high water clarity (Secchi disk depths often exceeding 8-10 meters), low nutrient concentrations (particularly total phosphorus < 5 µg/L), and low primary chlorophyll-a productivity.
- Limiting Nutrient: In Great Lakes freshwater systems, phosphorus is generally the primary limiting nutrient controlling algal blooms. Excessive nitrogen and phosphorus runoff from agricultural fertilizers, stormwater, and failing septic tanks can lead to cultural eutrophication.

3. Invasive Species & Ecological Restructuring
The Great Lakes and Grand Traverse Bay have been drastically modified by non-native aquatic invasive species:
- Dreissenid Mussels (Zebra and Quagga Mussels): Filter-feeding bivalves that filter massive volumes of water, concentrating nutrients on the lakebed and stripping the pelagic food web of phytoplankton. This has decimated the native amphipod Diporeia, a historic foundation for native prey fish.
- Round Goby (Neogobius melanostomus): Bottom-dwelling fish from the Black and Caspian Seas that preys on native fish eggs but has also become a primary food source for native Smallmouth Bass and Lake Trout.
- Sea Lamprey (Petromyzon marinus): Parasitic jawless fish that devastated native Lake Trout (Salvelinus namaycush) populations until targeted lampricide (TFM) treatments controlled their spawning tributaries.

4. Watershed Protection and the Boardman-Ottaway River
The Boardman-Ottaway River is the largest tributary discharging into West Grand Traverse Bay. The historic Boardman River Restoration Project successfully removed multiple aging hydroelectric dams (including Brown Bridge, Boardman, and Sabin dams), reconnecting over 160 miles of cold-water river habitat for native brook trout, restoring natural gravel sediment transport, and establishing a model for freshwater watershed revitalization in North America.`,
  },
  {
    id: 'bio-respiration',
    title: 'Cellular Respiration & Energy Metabolism',
    subject: 'Biology 101',
    suggestedQuestions: 8,
    sourceText: `Cellular Respiration and Energy Metabolism: Lecture Notes & Chapter Summary

1. Overview of Cellular Respiration
Cellular respiration is the metabolic pathway through which biological cells break down glucose in the presence of oxygen to synthesize adenosine triphosphate (ATP), the primary energy currency of the cell. The net chemical formula for aerobic cellular respiration is:
C6H12O6 + 6O2 -> 6CO2 + 6H2O + ~30-32 ATP + heat.
The process is catabolic and exergonic. It occurs in three major successive stages: Glycolysis, the Citric Acid Cycle (also known as the Krebs cycle or TCA cycle), and Oxidative Phosphorylation.

2. Stage 1: Glycolysis
- Location: The cytoplasm (cytosol) of the cell.
- Oxygen Requirement: Anaerobic (requires no oxygen).
- Reactants & Products: One six-carbon glucose molecule is broken down into two three-carbon pyruvate molecules.
- Energy Yield: A net yield of 2 ATP (via substrate-level phosphorylation) and 2 NADH electron carriers.
- Rate-Limiting Enzyme: Phosphofructokinase-1 (PFK-1), allosterically inhibited by high levels of ATP and citrate, and stimulated by AMP and ADP.

3. The Link Reaction (Pyruvate Decarboxylation)
- Location: Mitochondrial matrix.
- Before entering the Krebs cycle, each pyruvate is actively transported across the mitochondrial membranes.
- Pyruvate dehydrogenase removes a carboxyl group as CO2, attaches Coenzyme A, and reduces NAD+ to NADH, producing Acetyl-CoA.

4. Stage 2: The Citric Acid Cycle (Krebs Cycle)
- Location: Mitochondrial matrix.
- Cycle Mechanics: The two-carbon acetyl group of Acetyl-CoA condenses with a four-carbon oxaloacetate molecule to form six-carbon citrate.
- Two cycles occur per initial glucose molecule (one per Acetyl-CoA).
- Net yield per glucose (2 turns): 4 CO2, 6 NADH, 2 FADH2, and 2 ATP (or GTP).
- Oxaloacetate is regenerated at the end of each turn, completing the cycle.

5. Stage 3: Oxidative Phosphorylation & the Electron Transport Chain (ETC)
- Location: The inner mitochondrial membrane (cristae).
- Electron Transport Chain: Composed of Protein Complexes I, II, III, and IV, plus mobile electron shuttles Coenzyme Q (ubiquinone) and Cytochrome c.
- As electrons donated by NADH and FADH2 pass down the chain through redox reactions, protons (H+) are pumped from the mitochondrial matrix into the intermembrane space, establishing an electrochemical proton gradient (proton-motive force).
- Oxygen acts as the final terminal electron acceptor at Complex IV, combining with protons and electrons to produce water (H2O). If oxygen is absent, the ETC halts.
- Chemiosmosis & ATP Synthase: Protons flow down their electrochemical gradient back into the matrix through the enzyme ATP Synthase. This rotary motor phosphorylates ADP to yield approximately 26 to 28 ATP molecules per glucose.

6. Anaerobic Fermentation
When oxygen is scarce, cells regenerate NAD+ from NADH via fermentation to allow glycolysis to continue. In human muscle cells, pyruvate is reduced to lactic acid (lactate dehydrogenase). In yeast, pyruvate is decarboxylated to acetaldehyde and reduced to ethanol. Fermentation yields only 2 ATP per glucose.`,
  },
  {
    id: 'history-constitution',
    title: 'The Constitutional Convention of 1787',
    subject: 'US History / Political Science',
    suggestedQuestions: 6,
    sourceText: `The Constitutional Convention of 1787 and the American Framing

1. The Road to Philadelphia
In May 1787, 55 delegates gathered at the Pennsylvania State House in Philadelphia. The initial formal charge was to revise the Articles of Confederation, which had established a weak unicameral national government without an executive branch, a federal judiciary, or the power to levy taxes and regulate interstate commerce. Events such as Shays' Rebellion (1786-1787) in Massachusetts had convinced many national leaders, including George Washington and Alexander Hamilton, that a stronger federal union was vital.

2. The Virginia Plan vs. The New Jersey Plan
- The Virginia Plan: Drafted by James Madison and introduced by Edmund Randolph. Proposed a powerful bicameral legislature where representation in both houses would be apportioned based on population or wealth. It favored populous states like Virginia and Pennsylvania.
- The New Jersey Plan: Introduced by William Paterson. Proposed preserving the unicameral congress of the Articles where each state had exactly one vote, regardless of population size. Favored smaller states like Delaware and New Jersey.

3. The Great Compromise (Connecticut Compromise)
Brokered by Roger Sherman and Oliver Ellsworth of Connecticut, the Great Compromise resolved the representation debate by establishing a bicameral legislature:
- The House of Representatives: Apportioned by population, directly elected by the people, satisfying large states.
- The Senate: Equal representation with two senators per state (initially chosen by state legislatures until the 17th Amendment in 1913), satisfying small states.
All revenue-raising bills were required to originate in the House of Representatives.

4. The Three-Fifths Compromise & The Slave Trade
Sectional divisions between Northern and Southern states emerged over slavery. Southern states wanted enslaved people counted for representation in Congress but not for direct taxation. The Three-Fifths Compromise determined that three-fifths of enslaved persons would be counted for both representation and taxation. Additionally, Congress was barred from prohibiting the transatlantic slave trade until 1808.

5. Separation of Powers and Federalism
The Constitution established three distinct branches: Legislative (Article I), Executive (Article II), and Judicial (Article III), bound by a system of checks and balances (e.g., Presidential veto, Congressional override, Senate advice and consent). The framers created the Electoral College as an indirect mechanism for selecting the President.

6. The Ratification Debate & The Bill of Rights
Ratification required approval by nine of the thirteen states. Federalists (Alexander Hamilton, James Madison, John Jay) defended the new framework in The Federalist Papers. Anti-Federalists (Patrick Henry, George Mason) opposed it, fearing executive tyranny and the lack of a explicit declaration of individual liberties. To secure ratification in key states like Virginia and New York, Federalists pledged to add a Bill of Rights, which James Madison drafted and Congress passed in 1789 (ratified in 1791 as the first ten amendments).`,
  },
  {
    id: 'cs-os-concurrency',
    title: 'Operating Systems: Concurrency & Deadlocks',
    subject: 'Computer Science',
    suggestedQuestions: 6,
    sourceText: `Operating Systems: Concurrency, Synchronization, and Deadlocks

1. Processes vs. Threads
A process is an executing program instance with its own isolated address space, page tables, file descriptors, and security context. A thread is the smallest schedulable unit of CPU execution within a process. Multiple threads within the same process share code, global data, and heap memory, but each thread possesses its own program counter, register state, and stack.

2. The Critical Section Problem and Race Conditions
A race condition occurs when multiple threads or processes concurrently access and manipulate shared state, and the final outcome depends on the nondeterministic order of execution.
The critical section is the sequence of instructions accessing shared resources. Any valid solution must satisfy three core criteria:
- Mutual Exclusion: If thread T is executing in its critical section, no other threads may execute in that critical section.
- Progress: If no thread is in its critical section and some wish to enter, selection of the next thread cannot be indefinitely postponed.
- Bounded Waiting: A limit must exist on the number of times other threads can enter after a thread has requested access, preventing starvation.

3. Synchronization Primitives
- Mutex (Mutual Exclusion Lock): A binary locking mechanism providing exclusive lock and unlock operations. Only the thread that acquires a mutex can release it.
- Semaphore: An integer variable accessed via two atomic operations: wait() (decrement/P) and signal() (increment/V). A counting semaphore controls access to a finite resource pool.
- Condition Variables: Synchronization constructs allowing threads to sleep until notified that a specific boolean predicate has been fulfilled.

4. The Four Coffman Conditions for Deadlock
A deadlock is a permanent state where a set of processes are blocked because each process holds a resource and waits for another resource held by another process. For a deadlock to occur, all four Coffman conditions must hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must currently hold at least one resource and be waiting to acquire additional resources held by others.
3. No Preemption: Resources cannot be forcibly seized; they can only be released voluntarily by the holding process.
4. Circular Wait: A closed chain of processes {P0, P1, ..., Pn} must exist such that P0 waits for a resource held by P1, P1 waits for P2, and Pn waits for P0.

5. Deadlock Handling Strategies
- Prevention: Invalidate at least one of the four Coffman conditions (e.g., impose a global total ordering on resource allocation to prevent circular wait).
- Avoidance: Dynamically evaluate resource requests using algorithms like Dijkstra's Banker's Algorithm to ensure the system never transitions into an unsafe state.
- Detection and Recovery: Allow deadlocks to happen, detect cycles using Resource Allocation Graphs (Wait-For Graphs), and recover via process termination or resource preemption.
- Ostrich Algorithm: Ignore the problem entirely if deadlocks occur infrequently (common in general-purpose OS like Unix and Windows).`,
  },
];
