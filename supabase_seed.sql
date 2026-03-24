-- =============================================================================
-- CDAC CCAT Mock Test Seed Data
-- Run this in your Supabase SQL Editor (it runs as service role, bypasses RLS)
-- =============================================================================
-- Question JSON structure: { "sectionA": [...50 questions], "sectionB": [...50 questions] }
-- Each question: { "id": "a1", "question": "...", "options": ["A","B","C","D"], "correct": 0 }
-- "correct" is the 0-based index of the correct option.
--
-- FREE tests use only sectionA (sectionB = []).
-- PREMIUM tests use both sectionA (Aptitude) AND sectionB (CS Topics).
-- =============================================================================

-- Wipe existing data so this script is idempotent
truncate public.mock_tests restart identity cascade;

-- =============================================================================
-- HELPER: Question banks as SQL variables
-- =============================================================================

-- We store the full question arrays in a temporary table to keep INSERTs DRY

do $seed$
declare
  section_a_json jsonb := $section_a$[
    {"id":"a1","question":"If a sum of money doubles in 8 years at simple interest, what is the annual rate of interest?","options":["10%","12.5%","15%","20%"],"correct":1},
    {"id":"a2","question":"A train 150 m long passes a pole in 15 seconds. What is the speed of the train?","options":["8 m/s","10 m/s","12 m/s","15 m/s"],"correct":1},
    {"id":"a3","question":"Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64","options":["50","64","37","26"],"correct":1},
    {"id":"a4","question":"There are 24 cats in a row. A cat is 15th from the left. What is its position from the right?","options":["8th","9th","10th","11th"],"correct":2},
    {"id":"a5","question":"The average of 5 consecutive even numbers is 30. What is the largest number?","options":["32","34","36","38"],"correct":1},
    {"id":"a6","question":"If CALM is coded as 3-1-12-13, how is DOME coded?","options":["4-15-13-5","4-14-13-5","4-15-14-5","4-16-13-5"],"correct":0},
    {"id":"a7","question":"P is taller than Q but shorter than R. S is taller than P. Who is the tallest?","options":["P","Q","R","S"],"correct":3},
    {"id":"a8","question":"A pipe fills a tank in 4 hours; another empties it in 12 hours. Together, the tank is filled in?","options":["4h","5h","6h","8h"],"correct":2},
    {"id":"a9","question":"What is 15% of 240?","options":["24","32","36","40"],"correct":2},
    {"id":"a10","question":"A shopkeeper gives 10% discount and still earns 8% profit. If cost is Rs 500, marked price is?","options":["Rs 550","Rs 600","Rs 650","Rs 700"],"correct":1},
    {"id":"a11","question":"Two numbers are in ratio 3:5. Their LCM is 75. Find the larger number.","options":["15","20","25","30"],"correct":2},
    {"id":"a12","question":"Ram walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from start?","options":["1km","3km","5km","8km"],"correct":1},
    {"id":"a13","question":"Find the missing term: 3, 9, 27, 81, ?","options":["162","243","324","729"],"correct":1},
    {"id":"a14","question":"A is the sister of B. C is the mother of B. D is the father of C. How is A related to D?","options":["Daughter","Granddaughter","Niece","Great-granddaughter"],"correct":1},
    {"id":"a15","question":"If 6 men can do a job in 10 days, how many men are needed to finish in 4 days?","options":["12","15","18","20"],"correct":1},
    {"id":"a16","question":"A bag has 4 red and 6 blue balls. What is the probability of picking a red ball?","options":["2/5","3/5","2/3","1/4"],"correct":0},
    {"id":"a17","question":"Which fraction is the largest: 3/4, 5/7, 7/9, 8/11?","options":["3/4","5/7","7/9","8/11"],"correct":2},
    {"id":"a18","question":"If x + y = 14 and x - y = 4, what is the product xy?","options":["40","45","48","50"],"correct":1},
    {"id":"a19","question":"A man bought an article for Rs 800 and sold it for Rs 1000. Find the profit percent.","options":["20%","22%","25%","28%"],"correct":2},
    {"id":"a20","question":"Water : H2O :: Salt : ?","options":["NaCl","KCl","NaOH","HCl"],"correct":0},
    {"id":"a21","question":"What is the next letter in the series: B, D, G, K, P, ?","options":["T","U","V","W"],"correct":2},
    {"id":"a22","question":"A boat travels 36 km upstream in 4.5 hours and 42 km downstream in 3.5 hours. Speed of stream?","options":["3 km/h","4 km/h","5 km/h","6 km/h"],"correct":0},
    {"id":"a23","question":"In a group of 70, 45 speak Hindi and 40 speak English. How many speak both?","options":["10","15","20","25"],"correct":1},
    {"id":"a24","question":"The selling price of 10 articles equals the cost price of 12 articles. Profit % is?","options":["16.67%","20%","22%","25%"],"correct":1},
    {"id":"a25","question":"Find the value of 1^2 + 2^2 + 3^2 + ... + 10^2","options":["285","385","485","585"],"correct":1},
    {"id":"a26","question":"If 7 Jan 2024 is Sunday, what day is 7 Feb 2024?","options":["Monday","Tuesday","Wednesday","Thursday"],"correct":2},
    {"id":"a27","question":"A room is 8m long, 6m wide and 4m high. What is the area of the four walls?","options":["112 m2","120 m2","122 m2","128 m2"],"correct":0},
    {"id":"a28","question":"A shopkeeper marks goods 40% above cost and gives 20% discount. Profit %?","options":["8%","10%","12%","14%"],"correct":2},
    {"id":"a29","question":"What is the compound interest on Rs 5000 at 10% per annum for 2 years?","options":["Rs 950","Rs 1000","Rs 1050","Rs 1100"],"correct":2},
    {"id":"a30","question":"Speed of a car is 54 km/h. What is its speed in m/s?","options":["12","15","18","20"],"correct":1},
    {"id":"a31","question":"What is the area of a right triangle with legs 6 cm and 8 cm?","options":["20 cm2","24 cm2","28 cm2","30 cm2"],"correct":1},
    {"id":"a32","question":"A man rows at 8 km/h in still water. If the river flows at 2 km/h, his downstream speed is?","options":["6 km/h","8 km/h","10 km/h","12 km/h"],"correct":2},
    {"id":"a33","question":"In what ratio must Rs 40/kg and Rs 60/kg sugar be mixed to get Rs 50/kg mixture?","options":["1:1","1:2","2:1","3:2"],"correct":0},
    {"id":"a34","question":"If a^2 + b^2 = 25 and ab = 12, find (a + b).","options":["5","7","8","13"],"correct":1},
    {"id":"a35","question":"A sum triples in 12 years at Simple Interest. The rate of interest is?","options":["16.67%","20%","25%","33.33%"],"correct":0},
    {"id":"a36","question":"5 letters are picked from A,B,C,D,E without repetition. Number of arrangements?","options":["60","120","240","720"],"correct":1},
    {"id":"a37","question":"A cube of side 4 cm is painted on all sides. How many 1 cm cubes have exactly 2 faces painted?","options":["8","16","24","32"],"correct":2},
    {"id":"a38","question":"A and B together take 10 days; A alone takes 15 days. How many days for B alone?","options":["20","25","30","35"],"correct":2},
    {"id":"a39","question":"The LCM of 24, 36 and 48 is?","options":["96","120","144","168"],"correct":2},
    {"id":"a40","question":"Antonym of BENEVOLENT?","options":["Kind","Generous","Malevolent","Caring"],"correct":2},
    {"id":"a41","question":"Clock : Time :: Thermometer : ?","options":["Heat","Temperature","Celsius","Mercury"],"correct":1},
    {"id":"a42","question":"If PAPER is coded as OZODQ, how is PENCIL coded?","options":["OEMBHK","ODMBHK","ODMCJK","OENCJL"],"correct":0},
    {"id":"a43","question":"Statements: All birds can fly. Penguins are birds. Conclusion: Penguins can fly. Valid?","options":["Valid","Invalid","Partially valid","Cannot say"],"correct":0},
    {"id":"a44","question":"All Roses are Flowers. Some Flowers are Red. Which is definitely true?","options":["All roses are red","Some roses are red","No rose is red","None of these"],"correct":3},
    {"id":"a45","question":"Four persons sit around a circular table. A is to the right of B. D is to the left of C. B and D are opposite. Who is opposite A?","options":["B","C","D","Cannot determine"],"correct":1},
    {"id":"a46","question":"HCF of 36 and 84 is?","options":["6","10","12","18"],"correct":2},
    {"id":"a47","question":"A can finish a work in 18 days and B in 9 days. If they work alternately starting with A, in how many days is work done?","options":["12","13","14","15"],"correct":1},
    {"id":"a48","question":"Pointing to a photo, a man says she is the daughter of my grandfather's only son. How is she related?","options":["Sister","Mother","Cousin","Aunt"],"correct":0},
    {"id":"a49","question":"What comes next? AZ, BY, CX, DW, ?","options":["EV","FU","VE","WD"],"correct":0},
    {"id":"a50","question":"A sum of Rs 12,000 is lent at 10% per annum CI. Amount after 2 years?","options":["Rs 13,200","Rs 14,400","Rs 14,520","Rs 14,000"],"correct":2}
  ]$section_a$;

  section_b_json jsonb := $section_b$[
    {"id":"b1","question":"What is the output?\n#include<stdio.h>\nint main(){int a=5,b=10; printf(\"%d\",a+++b); return 0;}","options":["15","16","Compile Error","Undefined Behavior"],"correct":0},
    {"id":"b2","question":"Which data structure uses the LIFO principle?","options":["Queue","Stack","Tree","Graph"],"correct":1},
    {"id":"b3","question":"Time complexity of Binary Search on a sorted array of n elements?","options":["O(1)","O(log n)","O(n)","O(n^2)"],"correct":1},
    {"id":"b4","question":"In C, sizeof(int) on a typical 32-bit system returns?","options":["1","2","4","8"],"correct":2},
    {"id":"b5","question":"Which OS scheduling algorithm can lead to starvation of low-priority processes?","options":["FCFS","Round Robin","Priority Scheduling","SJF Non-preemptive"],"correct":2},
    {"id":"b6","question":"What does DNS stand for?","options":["Data Network System","Domain Name System","Dynamic Name Server","Distributed Node Service"],"correct":1},
    {"id":"b7","question":"In a binary tree, the maximum number of nodes at level k (root at level 0) is?","options":["k","2k","2^k","k^2"],"correct":2},
    {"id":"b8","question":"Which normal form eliminates transitive dependencies?","options":["1NF","2NF","3NF","BCNF"],"correct":2},
    {"id":"b9","question":"What is the decimal value of 10 XOR 6?","options":["4","12","14","16"],"correct":1},
    {"id":"b10","question":"In C, what does the 'static' keyword mean inside a function body?","options":["Variable is global","Variable retains value between calls","Variable is constant","Variable is stored in heap"],"correct":1},
    {"id":"b11","question":"Inorder traversal of a Binary Search Tree (BST) yields?","options":["Random order","Reverse sorted order","Sorted ascending order","Level order"],"correct":2},
    {"id":"b12","question":"Which OSI layer is responsible for end-to-end communication and reliability?","options":["Network","Data Link","Transport","Session"],"correct":2},
    {"id":"b13","question":"A process waiting indefinitely for a resource held by another waiting process is called?","options":["Starvation","Deadlock","Thrashing","Race Condition"],"correct":1},
    {"id":"b14","question":"What is the output of: int x=3; printf(\"%d\", x<<2);","options":["6","9","12","24"],"correct":2},
    {"id":"b15","question":"Which SQL command permanently removes a table and its structure from the database?","options":["DELETE","REMOVE","DROP","TRUNCATE"],"correct":2},
    {"id":"b16","question":"Height of a complete binary tree with n nodes is?","options":["log2(n)","n-1","floor(log2(n))","n/2"],"correct":2},
    {"id":"b17","question":"Which C string function returns the length of a string (excluding null terminator)?","options":["sizeof()","strlen()","strsize()","length()"],"correct":1},
    {"id":"b18","question":"HTTP uses which port by default?","options":["21","25","80","443"],"correct":2},
    {"id":"b19","question":"Paging eliminates which type of memory fragmentation?","options":["Internal","External","Both","Neither"],"correct":1},
    {"id":"b20","question":"2's complement of binary 0101 (4-bit) is?","options":["1010","1011","0101","1101"],"correct":1},
    {"id":"b21","question":"Which sorting algorithm has the best worst-case time complexity of O(n log n)?","options":["Quick Sort","Bubble Sort","Merge Sort","Selection Sort"],"correct":2},
    {"id":"b22","question":"A foreign key in a relational table refers to the ___ of another table.","options":["Foreign key","Candidate key","Primary key","Alternate key"],"correct":2},
    {"id":"b23","question":"What does ICMP stand for?","options":["Internet Control Message Protocol","Internal Computer Messaging Protocol","Internet Common Management Protocol","Integrated Circuit Message Protocol"],"correct":0},
    {"id":"b24","question":"What is a null pointer in C?","options":["A pointer to integer 0","A pointer guaranteed to not point to any object","An uninitialized pointer","A void pointer"],"correct":1},
    {"id":"b25","question":"Which page-replacement algorithm is known to suffer from Belady's Anomaly?","options":["LRU","Optimal","FIFO","LFU"],"correct":2},
    {"id":"b26","question":"The minimum number of edges in a connected graph with n vertices is?","options":["n","n-1","n+1","2n"],"correct":1},
    {"id":"b27","question":"Which operation inserts an element into a stack?","options":["Enqueue","Push","Insert","Add"],"correct":1},
    {"id":"b28","question":"SELECT DISTINCT in SQL removes?","options":["NULL values","Duplicate rows","Empty columns","NULL and duplicate rows"],"correct":1},
    {"id":"b29","question":"Which network topology has the highest fault tolerance?","options":["Bus","Star","Ring","Mesh"],"correct":3},
    {"id":"b30","question":"In C, int *ptr; what is sizeof(ptr) on a 64-bit system?","options":["2","4","8","Depends on int size"],"correct":2},
    {"id":"b31","question":"In an AVL tree, the balance factor of any node must be in the range?","options":["-2 to 2","0 to 1","-1 to 1","0 to 2"],"correct":2},
    {"id":"b32","question":"ACID properties of a database transaction stand for?","options":["Atomicity, Consistency, Isolation, Durability","Atomicity, Concurrency, Integrity, Durability","Access, Consistency, Isolation, Data","Atomicity, Consistency, Integrity, Data"],"correct":0},
    {"id":"b33","question":"Which gate outputs 1 only when ALL inputs are 0?","options":["AND","OR","NOR","NAND"],"correct":2},
    {"id":"b34","question":"Time complexity of inserting an element into a sorted linked list (worst case)?","options":["O(1)","O(log n)","O(n)","O(n^2)"],"correct":2},
    {"id":"b35","question":"An interrupt is best described as?","options":["A hardware/software signal requesting immediate CPU attention","A type of memory","A cache miss event","A process scheduling algorithm"],"correct":0},
    {"id":"b36","question":"Which C standard library header is required to use malloc()?","options":["<stdio.h>","<string.h>","<stdlib.h>","<alloc.h>"],"correct":2},
    {"id":"b37","question":"A semaphore is primarily used for?","options":["Memory management","Process synchronization","Disk scheduling","Virtual memory management"],"correct":1},
    {"id":"b38","question":"HTTPS uses which port number by default?","options":["80","443","8080","8443"],"correct":1},
    {"id":"b39","question":"DeMorgan's theorem states: NOT(A AND B) equals?","options":["NOT A AND NOT B","NOT A OR NOT B","A OR B","A AND B"],"correct":1},
    {"id":"b40","question":"Which data structure is most efficient for implementing a priority queue?","options":["Array","Linked List","Heap","Stack"],"correct":2},
    {"id":"b41","question":"In SQL, which aggregate function returns the number of rows?","options":["SUM()","AVG()","COUNT()","MAX()"],"correct":2},
    {"id":"b42","question":"Context switching in an OS occurs when?","options":["CPU switches from one process to another","RAM reaches capacity","A cache miss occurs","A program terminates normally"],"correct":0},
    {"id":"b43","question":"What does 'int a[]={1,2,3}; printf(\"%d\",*(a+1));' print in C?","options":["1","2","3","Memory address"],"correct":1},
    {"id":"b44","question":"Which protocol is used to assign IP addresses dynamically to hosts?","options":["ARP","DHCP","FTP","ICMP"],"correct":1},
    {"id":"b45","question":"Which OSI model layer is responsible for packet routing between networks?","options":["Physical","Data Link","Network","Transport"],"correct":2},
    {"id":"b46","question":"Recursion internally uses which data structure?","options":["Queue","Stack","Heap","Binary Tree"],"correct":1},
    {"id":"b47","question":"A relation in 2NF must be in 1NF and have no?","options":["Multi-valued dependencies","Partial dependencies","Transitive dependencies","Join dependencies"],"correct":1},
    {"id":"b48","question":"Minimum number of NAND gates required to implement a NOT gate?","options":["1","2","3","4"],"correct":0},
    {"id":"b49","question":"Memory allocated using malloc() in C is stored in?","options":["Stack","Static segment","Heap","Register"],"correct":2},
    {"id":"b50","question":"Which data structure improves Dijkstra's algorithm efficiency?","options":["Stack","Simple Queue","Priority Queue (Min-Heap)","Hash Map"],"correct":2}
  ]$section_b$;

  free_test_1_id uuid;
  free_test_2_id uuid;
begin
  -- =========================================================================
  -- FREE TEST 1: Section A — General Aptitude & Logical Reasoning
  -- =========================================================================
  insert into public.mock_tests (title, type, duration, questions)
  values (
    'Section A: General Aptitude & Logical Reasoning',
    'free',
    60,
    jsonb_build_object('sectionA', section_a_json, 'sectionB', '[]'::jsonb)
  ) returning id into free_test_1_id;

  -- =========================================================================
  -- FREE TEST 2: Section B — C Programming & Computer Science
  -- =========================================================================
  insert into public.mock_tests (title, type, duration, questions)
  values (
    'Section B: C Programming & Data Structures',
    'free',
    60,
    jsonb_build_object('sectionA', section_b_json, 'sectionB', '[]'::jsonb)
  ) returning id into free_test_2_id;

  -- =========================================================================
  -- PREMIUM TEST 1–5: Full Length CCAT Simulation (Section A + Section B)
  -- Each premium test contains all 100 questions. Frontend shuffles per attempt.
  -- =========================================================================
  insert into public.mock_tests (title, type, duration, questions) values
  (
    'Full Length Mock Test 1 – CCAT 2026 Pattern',
    'premium', 120,
    jsonb_build_object('sectionA', section_a_json, 'sectionB', section_b_json)
  ),
  (
    'Full Length Mock Test 2 – Advanced Topics',
    'premium', 120,
    jsonb_build_object('sectionA', section_a_json, 'sectionB', section_b_json)
  ),
  (
    'Full Length Mock Test 3 – Previous Year Simulation',
    'premium', 120,
    jsonb_build_object('sectionA', section_a_json, 'sectionB', section_b_json)
  ),
  (
    'Full Length Mock Test 4 – Mixed Difficulty',
    'premium', 120,
    jsonb_build_object('sectionA', section_a_json, 'sectionB', section_b_json)
  ),
  (
    'Full Length Mock Test 5 – Final Full Simulation',
    'premium', 120,
    jsonb_build_object('sectionA', section_a_json, 'sectionB', section_b_json)
  );

  raise notice 'Seeded 2 free tests and 5 premium tests successfully.';
end;
$seed$;

-- =============================================================================
-- VERIFICATION QUERY — run this after seeding to confirm data
-- =============================================================================
-- select id, title, type, duration,
--   jsonb_array_length(questions->'sectionA') as section_a_count,
--   jsonb_array_length(questions->'sectionB') as section_b_count
-- from public.mock_tests
-- order by type, created_at;
