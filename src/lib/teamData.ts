// Team data parsing utility

export interface TeamMember {
  name: string;
  batch: string;
  contact: string;
  role: string;
  committee: string;
}

export interface CommitteeData {
  committeeName: string;
  members: TeamMember[];
}

// Raw CSV data - this would typically be loaded from the CSV file
const csvData = `S.No.,Batch ,Name,Contact No.,Role,,,,,,
,,,,,,,,,,
ORGANIZING HEAD,,,,,,,,,,
1,2023,DIYA GARG,7296859397,OH,,,,,,
"DISCIPLINE TEAM			",,,,,,,,,,
1,2024,Rahul Verma,9414828604,CORE,,,,,,
2,2023,Kriti Gupta,8619695311,CORE,,,,,,
3,2024,Kunal Kasliwal,6377987396,COORDINATOR,,,,,,
4,2024,Ashlesha Sharma ,7850816065,COORDINATOR,,,,,,
5,2024,Kartik Sharma ,8769329369,COORDINATOR,,,,,,
6,2024,Parul swami ,6375050886,COORDINATOR,,,,,,
7,2024,Satvik Agrawal ,8272031402,COORDINATOR,,,,,,
8,2024,Shikha sharma ,6261561942,COORDINATOR,,,,,,
9,2024,Lakshit Pareek ,9216333707,COORDINATOR,,,,,,
10,2024,Monu Sharma,9783983551,COORDINATOR,,,,,,
11,2024,Divyansh Choudhary,7230869878,COORDINATOR,,,,,,
12,2025,Aditi Punia,9680096100,VOLUNTEER,,,,,,
13,2025,Aman Anchaliya,9549696968,VOLUNTEER,,,,,,
14,2025,Aman Choudhary,6375830028,VOLUNTEER,,,,,,
15,2025,Ayush Gadwal,9828631820,VOLUNTEER,,,,,,
16,2025,Bhavya Doshi,7014763106,VOLUNTEER,,,,,,
17,2025,Bhavya Gupta ,8302914430,VOLUNTEER,,,,,,
18,2025,Bhavya Raj Singh Sarangdevot,7300076056,VOLUNTEER,,,,,,
19,2025,Chanchal Karanani,7297066050,VOLUNTEER,,,,,,
20,2025,Dharam Singh Choudhary,9119125584,VOLUNTEER,,,,,,
21,2025,Dishika Pancholi,9588934442,VOLUNTEER,,,,,,
22,2025,Divit Chaturvedi,9602138785,VOLUNTEER,,,,,,
23,2025,Divyansh Chopra,8000825994,VOLUNTEER,,,,,,
24,2025,Garima Maheshwari,8967258958,VOLUNTEER,,,,,,
25,2025,Hardik Kumawat,9001023997,VOLUNTEER,,,,,,
26,2025,Hemangi Sancheti,7357956666,VOLUNTEER,,,,,,
27,2025,Heramb Sharma,6377827962,VOLUNTEER,,,,,,
28,2025,Himani Menghani,9509221101,VOLUNTEER,,,,,,
29,2025,Keshav Singh Shekhawat ,7023730893,VOLUNTEER,,,,,,
30,2025,Khanak Jain,8104805555,VOLUNTEER,,,,,,
31,2025,Koushal Jangir,9509489793,VOLUNTEER,,,,,,
32,2025,Naresh Roj,9509879995,VOLUNTEER,,,,,,
33,2025,Navya Sharma,9630277562,VOLUNTEER,,,,,,
34,2025,Parihaan Kabra,9057123555,VOLUNTEER,,,,,,
35,2025,Purvi Naruka,6378375420,VOLUNTEER,,,,,,
36,2025,Raghav Sharma,7849902293,VOLUNTEER,,,,,,
37,2025,Raghuraj Jangid,8306203348,VOLUNTEER,,,,,,
38,2025,Rishabh Choudhary ,8949880117,VOLUNTEER,,,,,,
39,2025,Shouryaveer Bishnoi,9828692129,VOLUNTEER,,,,,,
40,2025,Tanishq Daiya,7611964099,VOLUNTEER,,,,,,
41,2025,Tanmay Sharma,6367830722,VOLUNTEER,,,,,,
42,2025,Tarun Saran,8905119974,VOLUNTEER,,,,,,
43,2025,Tarushi,7877320323,VOLUNTEER,,,,,,
44,2025,Vaibhav Charan,6376373583,VOLUNTEER,,,,,,
45,2025,Yashsvi Bothra,9875765696,VOLUNTEER,,,,,,
46,2025,Yatharth Chaturvedi,8529958544,VOLUNTEER,,,,,,
TECH & SUPPORT TEAM,,,,,,,,,,
1,2023,Suryaansh Sharma,6376905585,CORE,,,,,,
2,2024,Devam Gupta,7340015201,COORDINATOR,,,,,,
3,2024,Ayush Sharma,7014968183,COORDINATOR,,,,,,
4,2024,Atharv Mehrotra,6387183983,COORDINATOR,,,,,,
5,2024,Somay Agarwal,8130668138,COORDINATOR,,,,,,
6,2024,Yash Mishra,7007689708,COORDINATOR,,,,,,
7,2024,Prateek Saxena,8302553346,COORDINATOR,,,,,,
8,2024,Aman Pratap Singh,9456608637,COORDINATOR,,,,,,
9,2025,Rashi Katiyar,7878437857,VOLUNTEER,,,,,,
10,2025,Rudrapal Singh,7737472264,VOLUNTEER,,,,,,
11,2025,Raghuraj Singh Shekhawat,8955983385,VOLUNTEER,,,,,,
12,2025,Lakshay,9817856544,VOLUNTEER,,,,,,
13,2025,Shubh Dixit,9166750197,VOLUNTEER,,,,,,
14,2025,Srinivasa Sangeeth,8121808248,VOLUNTEER,,,,,,
15,2025,Priyanshi Agnani,9772217788,VOLUNTEER,,,,,,
16,2025,Kanika Suthar,9680570484,VOLUNTEER,,,,,,
17,2025,Kajal Agarwal,8686340701,VOLUNTEER,,,,,,
18,2025,Chandan Prit Singh,8829805833,VOLUNTEER,,,,,,
19,2025,Parth Dhoot,9145941190,VOLUNTEER,,,,,,
20,2025,Pradhuman Thanvi,6375455266,VOLUNTEER,,,,,,
21,2025,Siya Sharma,9119218502,VOLUNTEER,,,,,,
22,2025,Mansi Somani,9636866919,VOLUNTEER,,,,,,
23,2025,Ashutosh Yadav,9259068512,VOLUNTEER,,,,,,
24,2025,Kavita Sharma,9462149044,VOLUNTEER,,,,,,
25,2025,Aditi Sharma,8769266444,VOLUNTEER,,,,,,
TRANSPORTATION TEAM,,,,,,,,,,
1,2023,Anmol Sahu,7597432320,CORE,,,,,,
2,2024,Harshveer Singh Rathore,7851808052,COORDINATOR,,,,,,
3,2024,Vansh Sharma,8306499913,COORDINATOR,,,,,,
4,2024,Bhanu Upadhyay ,8769070887,VOLUNTEER,,,,,,
5,2024,Agamya Singh Chauhan,9352786715,VOLUNTEER,,,,,,
6,2024,Vaibhav Sharma,7014447368,VOLUNTEER,,,,,,
7,2025,Samarth Singh,9413803303,VOLUNTEER,,,,,,
PRIZE & CERTIFICATES TEAM,,,,,,,,,,
1,2023,Tanveer Kanderiya,9460288784,CORE,,,,,,
2,2023,Ashok Kumar,8742875775,COORDINATOR,,,,,,
3,2024,Shaik Areesh,7095149312,COORDINATOR,,,,,,
4,2024, Lokesh  Sharma,9898230461,COORDINATOR,,,,,,
5,2023,Priyanshi Mehta,9983293314,COORDINATOR,,,,,,
6,2025,Avika Soni,9828239900,VOLUNTEER,,,,,,
7,2023,Prashant Sharma,8949022638,VOLUNTEER,,,,,,
8,2025,Tarun Kumar,8764191998,VOLUNTEER,,,,,,
9,2023,Divyansh Pratap Singh,7494927871,VOLUNTEER,,,,,,
10,2025,Nikita ,9461543038,VOLUNTEER,,,,,,
11,2025,Rashi Chandnani,8209485439,VOLUNTEER,,,,,,
12,2023,Sahil Yadav,8708110218,VOLUNTEER,,,,,,
13,2025,Shivia Rawat ,7849833123,VOLUNTEER,,,,,,
14,2025,Atharv Mandal ,7728959804,VOLUNTEER,,,,,,
15,2025,Ruchi Choudhary,8905185761,VOLUNTEER,,,,,,
16,2024,Gurseerat Kaur,7678252871,VOLUNTEER,,,,,,
17,2025,Arjun Giri,9557055097,VOLUNTEER,,,,,,
PHOTOGRAPHY TEAM,,,,,,,,,,
1,2023,Shorya Prajapat,6367100390,CORE,,,,,,
2,2023,Ekansh Saraswat,9549807643,CORE,,,,,,
3,2024,Roshan Jangir,7877552810,COORDINATOR,,,,,,
4,2024,Kartik Singh,8905744728,COORDINATOR,,,,,,
5,2024,Aryan Jain,6377317903,COORDINATOR,,,,,,
6,2024,Devansh Srivastava,7050260475,COORDINATOR,,,,,,
7,2025,Sunay Kundalwal,8619804776,VOLUNTEER,,,,,,
8,2025,Vansh Vaibhav Singh ,7852862130,VOLUNTEER,,,,,,
9,2025,Kaushal Malvi,9644679988,VOLUNTEER,,,,,,
10,2025,Daksh Shukla ,8824809316,VOLUNTEER,,,,,,
11,2025,Katyayani Rathore,9479870270,VOLUNTEER,,,,,,
12,2025,Himani Saraf ,7229990039,VOLUNTEER,,,,,,
13,2025,Niharika Chauhan,9660622428,VOLUNTEER,,,,,,
14,2025,Arham Bothra,9079933040,VOLUNTEER,,,,,,
15,2025,Yogant Gupta ,7690004525,VOLUNTEER,,,,,,
16,2025,Agreema Gauttam ,9116882065,VOLUNTEER,,,,,,
17,2025,Muskan,7878712625,VOLUNTEER,,,,,,
18,2025,Harshita Harchandani,7470808031,VOLUNTEER,,,,,,
19,2025,Riddhi Sharma,7014857867,VOLUNTEER,,,,,,
20,2024,Raj Jasoria,7014488939,VOLUNTEER,,,,,,
21,2025,Aditya Vyas ,8955637102,VOLUNTEER,,,,,,
STAGE & VENUE TEAM,,,,,,,,,,
1,2023,Suryansh Khandelwal,8955347599,CORE,,,,,,
2,2023,Akash Saraswat,7014647818,CORE,,,,,,
3,2024,Nikita Kumawat ,9983678640,COORDINATOR,,,,,,
4,2024,Aditya Somani ,8233116585,COORDINATOR,,,,,,
5,2024,Yug Jain,9358210803,COORDINATOR,,,,,,
6,2024,Aman Gupta,8950739040,COORDINATOR,,,,,,
7,2024,Bhavya Bang ,7023282838,COORDINATOR,,,,,,
8,2024,Garv Sharma ,7852865011,COORDINATOR,,,,,,
9,2025,Tanvi Gupta,8302847403,VOLUNTEER,,,,,,
10,2025,Pari Nahata,8209095137,VOLUNTEER,,,,,,
11,2025,Nawya Dusad,8279220922,VOLUNTEER,,,,,,
12,2025,Sanskriti Gehlot ,8824500776,VOLUNTEER,,,,,,
13,2025,Chirag Kumar,7488645235,VOLUNTEER,,,,,,
14,2025,Nandani Rajawat ,9828252683,VOLUNTEER,,,,,,
15,2025,Harshwardhan,9460652938,VOLUNTEER,,,,,,
16,2025,Gaurav Sharma,9351054737,VOLUNTEER,,,,,,
17,2025,Purvi Jain,7877082586,VOLUNTEER,,,,,,
18,2025,Ayush Jaiswal ,9473326155,VOLUNTEER,,,,,,
19,2025,Anuj Soni,7568776359,VOLUNTEER,,,,,,
20,2025,Ritik Sharma ,8306936227,VOLUNTEER,,,,,,
21,2025,G.vishwaroopachary,9849676054,VOLUNTEER,,,,,,
REGISTRATIONS TEAM,,,,,,,,,,
1,2023,Ayushi Kabra,9352306947,CORE,,,,,,
2,2024,Jayash Gahlot,8306274199,CORE,,,,,,
3,2024,Rashi Lunawat,8104204489,COORDINATOR,,,,,,
4,2024,Ashmit Sharma,8209945432,COORDINATOR,,,,,,
5,2024,Shivam Lakshkar ,9929935561,COORDINATOR,,,,,,
6,2024,Saumya Puri,9458982055,COORDINATOR,,,,,,
7,2024,Monika Khichar,8690546147,COORDINATOR,,,,,,
8,2024,Ankit Joshi,9354116261,COORDINATOR,,,,,,
9,2024,Atashi Kashyap,7425954853,COORDINATOR,,,,,,
10,2024,Ashmi Sharma,8003740493,COORDINATOR,,,,,,
11,2025,Anirudh Choudhary,8690943532,VOLUNTEER,,,,,,
12,2025,Droni Sehgal,7737984411,VOLUNTEER,,,,,,
13,2025,Vidhaan P Shah,7357252112,VOLUNTEER,,,,,,
14,2025,Anandi Kolapkar,7219879565,VOLUNTEER,,,,,,
15,2025,Abhishek,9235245386,VOLUNTEER,,,,,,
16,2025,Nandini Shah ,9358369605,VOLUNTEER,,,,,,
17,2025,Darshita Jain,6378803495,VOLUNTEER,,,,,,
18,2025,Naveen Tholiya,7023506758,VOLUNTEER,,,,,,
19,2025, Yash Gill,9521734317,VOLUNTEER,,,,,,
20,2025,Yuvraj Singh Rathore ,9351912044,VOLUNTEER,,,,,,
21,2025,Purvee Dudheria,9352221827,VOLUNTEER,,,,,,
22,2025,Shreshtha Sharma,9660599045,VOLUNTEER,,,,,,
23,2025,Pranjal Jangid ,9828188830,VOLUNTEER,,,,,,
24,2025,Harshul Agarwal,7742991906,VOLUNTEER,,,,,,
25,2024,Akshara Saini,9929084866,VOLUNTEER,,,,,,
26,2024,Priya Sahu,9142652574,VOLUNTEER,,,,,,
SOCIAL MEDIA TEAM,,,,,,,,,,
1,2023,Vandan P. Shah,7357651554,CORE,,,,,,
2,2024,Aditya Nayak ,9116727168,COORDINATOR,,,,,,
3,2024,Akshara Gupta,9351775867,COORDINATOR,,,,,,
4,2024,Deepanshu Singh,7340188047,COORDINATOR,,,,,,
5,2024,Vaibhav Khandelwal,6367511127,COORDINATOR,,,,,,
6,2024,Manvi Gurjar,9001979310,COORDINATOR,,,,,,
7,2025,Priyanshi Singhvi,9521081674,VOLUNTEER,,,,,,
8,2025,Aman Kumawat,9509120066,VOLUNTEER,,,,,,
9,2025,Nikita Bhatia,7742314923,VOLUNTEER,,,,,,
10,2025,Minal Jain,9414922900,VOLUNTEER,,,,,,
11,2025,Chirag Negi,9829633388,VOLUNTEER,,,,,,
12,2025,Nandini Mittal,8078606805,VOLUNTEER,,,,,,
13,2025,Padmini Singh,8107011698,VOLUNTEER,,,,,,
14,2025,Gauri Singhi,8305015800,VOLUNTEER,,,,,,
15,2025,Aditi Agarwal ,8955987037,VOLUNTEER,,,,,,
HOSPITALITY TEAM,,,,,,,,,,
1,2023,Aayushi Meel,9257541032,CORE,,,,,,
2,2023,Dheevi Fozdar,9729871153,CORE,,,,,,
3,2024,Nehal Khandelwal,8949429104,COORDINATOR,,,,,,
4,2024,Astha Barnwal,7987019118,COORDINATOR,,,,,,
5,2024,Adityavardhan ,8955738808,COORDINATOR,,,,,,
6,2024,Tanik Gupta,9929396663,COORDINATOR,,,,,,
7,2024,Chailsi Jain,7737572065,COORDINATOR,,,,,,
8,2024,Garima Sharma,8306688879,VOLUNTEERS,,,,,,
9,2024,Vagisha Singh Kapasia,7877918081,VOLUNTEERS,,,,,,
10,2025,Mrudula Chinke,8007715833,VOLUNTEERS,,,,,,
11,2025,Prince Soni,9887646103,VOLUNTEERS,,,,,,
12,2025,Prakhar Jain,8448583701,VOLUNTEERS,,,,,,
13,2025,Pratham Lalwani,7232857451,VOLUNTEERS,,,,,,
14,2025,Aalap Goswami,9783081486,VOLUNTEERS,,,,,,
15,2025,Vansh Bhatia,9413833334,VOLUNTEERS,,,,,,
16,2025,Kavya Gupta,6263137120,VOLUNTEERS,,,,,,
17,2025,Nayana,6362385123,VOLUNTEERS,,,,,,
INTERNAL ARRANGEMENTS TEAM,,,,,,,,,,
1,2023,Lakshay Khandelwal,7976413634,CORE,,,,,,
2,2024,Pulkit Dosi ,9887788899,COORDINATOR,,,,,,
3,2024,Riya Chauhan,8306769710,COORDINATOR,,,,,,
4,2024,Aryan Pamecha ,7737382308,COORDINATOR,,,,,,
5,2024,Shivika Kesharwani ,8737800889,COORDINATOR,,,,,,
6,2024,Aryan Gupta,8302958564,COORDINATOR,,,,,,
7,2024,Kakul Goyal,9329245468,COORDINATOR,,,,,,
8,2024,Dhananjay Sharma ,7357904367,COORDINATOR,,,,,,
9,2024,Jitesh Khandelwal,7877516411,VOLUNTEER,,,,,,
10,2025,Akarsh Pareek ,6350062365,VOLUNTEER,,,,,,
11,2025,Charvi Sharma ,8847490178,VOLUNTEER,,,,,,
12,2025,Anvi Vashist ,887551450,VOLUNTEER,,,,,,
13,2025,Rajan Kumawat,9257007824,VOLUNTEER,,,,,,
14,2025,Amandeep Singh Rathore ,8529628294,VOLUNTEER,,,,,,
15,2025,Mohammed Ozair Shah,8829852070,VOLUNTEER,,,,,,
16,2025,Jitendra ,9653840559,VOLUNTEER,,,,,,
17,2025,Riya Sharma ,7976236023,VOLUNTEER,,,,,,
18,2025,Varun Teja Ankarla ,9573857352,VOLUNTEER,,,,,,
19,2025,Shreyansh Mishra ,8094259011,VOLUNTEER,,,,,,
20,2025,Ashutosh Gupta,9509619872,VOLUNTEER,,,,,,
21,2025,Risha Saini ,7296947096,VOLUNTEER,,,,,,
22,2025,Shambhavi singh,9452588089,VOLUNTEER,,,,,,
CULTURAL EVENTS TEAM,,,,,,,,,,
1,2023,Satvick Vaid,7014193353,CORE,,,,,,
2,2024,Jheel Jain,8114491796,COORDINATOR,,,,,,
3,2024,Pratigya Bomb,6264667506,COORDINATOR,,,,,,
4,2024,Nehal Mittal,9829939993,COORDINATOR,,,,,,
5,2024,Mayank Soni,9799901191,COORDINATOR,,,,,,
6,2024,Anurika A,8921646419,COORDINATOR,,,,,,
7,2024,Ankita Choudhary,9351246611,COORDINATOR,,,,,,
8,2024,Mayank Shankar Pathak,9131171030,COORDINATOR,,,,,,
9,2024,Madhav Garg,7017198900,COORDINATOR,,,,,,
10,2024,Gourang Tak,8058477540,COORDINATOR,,,,,,
11,2024,Pragyansh Mishra ,7597291845,COORDINATOR,,,,,,
12,2024,Adhya Mittal,9024405295,COORDINATOR,,,,,,
13,2024,Mansi,9351921082,VOLUNTEER,,,,,,
14,2025,Aadrika Roy,9423486807,VOLUNTEER,,,,,,
15,2025,Akshat Bisht ,9509693736,VOLUNTEER,,,,,,
16,2025,Ankush Panda ,8240832834,VOLUNTEER,,,,,,
17,2025,Anubha Sharma,9829820425,VOLUNTEER,,,,,,
18,2025,Arnav Sharma,8107090676,VOLUNTEER,,,,,,
19,2025,Chelsy Tanwar ,9119289533,VOLUNTEER,,,,,,
20,2025,Dev Gautam,9896527244,VOLUNTEER,,,,,,
21,2025,Divya Malik,7017160230,VOLUNTEER,,,,,,
22,2025,Eishit Gupta,7292013525,VOLUNTEER,,,,,,
23,2025,Hardik Yadav,9610300303,VOLUNTEER,,,,,,
24,2025,Megh Kedia ,9829076464,VOLUNTEER,,,,,,
25,2025,Naina Dayaramani ,8982800788,VOLUNTEER,,,,,,
26,2025,Nancy sain,93519499,VOLUNTEER,,,,,,
27,2025,Prekshya Sharma ,7850984940,VOLUNTEER,,,,,,
28,2025,Rahul Gorani,6367427790,VOLUNTEER,,,,,,
29,2025,Saanchi Vijayvergia ,9509481665,VOLUNTEER,,,,,,
30,2025,Sakshi Jain,9352343451,VOLUNTEER,,,,,,
31,2025,Samriddhi Singh ,7974779477,VOLUNTEER,,,,,,
32,2025,Samridhi Singh,8851168424,VOLUNTEER,,,,,,
33,2025,Saumya Agarwal,9897110960,VOLUNTEER,,,,,,
34,2025,Shivansh Sharma,8000649601,VOLUNTEER,,,,,,
35,2025,Arshey Rai,6391326252,VOLUNTEER,,,,,,
36,2025,Madhu Swami,7374063177,VOLUNTEER,,,,,,
37,2025,Dishika Sharma,8949133702,VOLUNTEER,,,,,,
38,2025,Jiya Dhanwani,7073508935,VOLUNTEER,,,,,,
39,2025,Mallareddi Charan,9692912166,VOLUNTEER,,,,,,
DECOR TEAM,,,,,,,,,,
1,2023,Jinal Lodha,9983658102,CORE,,,,,,
2,2023,Jigeesha Agarawal,7007282212,CORE,,,,,,
3,2024,Ayaan Mathur,6378136157,COORDINATOR,,,,,,
4,2024,Bhawesh Chandnani,7877775484,COORDINATOR,,,,,,
5,2024,Chahak Agarwal,6350673074,COORDINATOR,,,,,,
6,2024,Kartik Phulwari,7877080919,COORDINATOR,,,,,,
7,2025,Aayushi Kaushik,9251130800,VOLUNTEER,,,,,,
8,2025,Abhirama K Sreyas,9100668862,VOLUNTEER,,,,,,
9,2025,Akshat Murarka,9153498719,VOLUNTEER,,,,,,
10,2025,Anshika Soni,9414653513,VOLUNTEER,,,,,,
11,2025,Arihant Jain,6367045695,VOLUNTEER,,,,,,
12,2025,Arnav Rawat,9682601220,VOLUNTEER,,,,,,
13,2025,Arunil Jain,8890301492,VOLUNTEER,,,,,,
14,2025,Aviral Sherawat,7414085881,VOLUNTEER,,,,,,
15,2025,Avnika Vyas,8949820056,VOLUNTEER,,,,,,
16,2025,Bhumika Daharwal,7974986528,VOLUNTEER,,,,,,
17,2025,Yuvraj Singh,9166884991,VOLUNTEER,,,,,,
18,2025,Drashya Jain,9079142712,VOLUNTEER,,,,,,
19,2025,Hritvika Vashistha,9024514062,VOLUNTEER,,,,,,
20,2025,Lakshita Tanwar,9251016998,VOLUNTEER,,,,,,
21,2025,Lakshya Gupta,7597370438,VOLUNTEER,,,,,,
22,2025,Mahi Tripathi,8819990999,VOLUNTEER,,,,,,
23,2025,Mrinal Khandal,8875903661,VOLUNTEER,,,,,,
24,2025,Natwar Singh Shekhawat ,9636178459,VOLUNTEER,,,,,,
25,2025,Pratistha Chechani,6376856248,VOLUNTEER,,,,,,
26,2025,Ridhwik Tailor,8824343789,VOLUNTEER,,,,,,
27,2025,Shabd Srivastava,7011114613,VOLUNTEER,,,,,,
28,2025,Siddhant Singh Jadoun,9587748708,VOLUNTEER,,,,,,
29,2025,Udit Mishra,9509908119,VOLUNTEER,,,,,,
30,2025,Yashvardhan Singh,7878673465,VOLUNTEER,,,,,,
SPONSORSHIP & PROMOTIONS TEAM,,,,,,,,,,
1,2024,Naman Shukla,9929727849,CORE,,,,,,
2,2024,Rishika Sharma ,9929175875,COORDINATOR,,,,,,
3,2024,Harshita Kanwar ,7976455145,COORDINATOR,,,,,,
4,2024,Smile Chhabra,9571839843,COORDINATOR,,,,,,
5,2024,Avni Gupta,8529560599,COORDINATOR,,,,,,
6,2025,Adipoojya Mehra,7375023015,VOLUNTEER,,,,,,
7,2025,Manan Sharma,7372913432,VOLUNTEER,,,,,,
8,2025,Chintan Sharma,7568823574,VOLUNTEER,,,,,,
9,2025,Bhavisha Sabani,7878530529,VOLUNTEER,,,,,,
10,2025,Ghyan Chechani,8824600720,VOLUNTEER,,,,,,
11,2025,Pranjal Jain,7976743758,VOLUNTEER,,,,,,
12,2025,Sanchi Dhoopia,9664356901,VOLUNTEER,,,,,,
13,2025,Jainam Jain,8000796223,VOLUNTEER,,,,,,
MEDIA & REPORT TEAM,,,,,,,,,,
1,2023,Prabal Agarwal,9098631828,CORE,,,,,,
2,2024,Nayna Dubey,9305173405,COORDINATOR,,,,,,
3,2024,Parineeta Jain,7024620065,COORDINATOR,,,,,,
4,2024,Nidhish Tripathi,8764497220,COORDINATOR,,,,,,
5,2024,Cheshta Kulshrestha ,9928883938,COORDINATOR,,,,,,
6,2024,Anshumann Dhaka,9571234678,VOLUNTEER,,,,,,
7,2025,Pratiki Agarwal ,8000021198,VOLUNTEER,,,,,,
8,2025,Gouranshi Sharma ,8890174914,VOLUNTEER,,,,,,
9,2025,Anukriti Choudhary ,7424841969,VOLUNTEER,,,,,,
10,2025,Aditi Sharma,9928456059,VOLUNTEER,,,,,,
11,2025,Komal Verma,8209421348,VOLUNTEER,,,,,,
12,2025,Arshiyaa Yadav,9414228604,VOLUNTEER,,,,,,
13,2025,R.Varshitha Reddy,9502874449,VOLUNTEER,,,,,,
14,2025,Garvishtha Asnani,7878504420,VOLUNTEER,,,,,,
ANCHORS TEAM,,,,,,,,,,
1,2023,Chahat Khandelwal ,9460145987,CORE,,,,,,
2,2024,Akshali Srivastava,9509981026,COORDINATOR,,,,,,
3,2024,Nitya Manglani,7880039399,COORDINATOR,,,,,,
4,2024,Swadha Saxena,9079707725,COORDINATOR,,,,,,
5,2024,Laksh sharma,8094110057,COORDINATOR,,,,,,
6,2025,Rusham,9314629667,VOLUNTEER,,,,,,
7,2025,Avneesh Kumar Dubey,8448172686,VOLUNTEER,,,,,,
8,2025,Himanshu,9251015254,VOLUNTEER,,,,,,
9,2025,Dhanyashree Sen,6378092919,VOLUNTEER,,,,,,
10,2025,Abigail,7016338365,VOLUNTEER,,,,,,
11,2024,Daksh Kumar,8949291337,VOLUNTEER,,,,,,
12,2024,Faizi Ali,6350612878,VOLUNTEER,,,,,,
13,2025,Anushri Falor,9314267009,VOLUNTEER,,,,,,
14,2025,Shubhi Jain,9116160224,VOLUNTEER,,,,,,
15,2025,Garvit Agrawal,9024079027,VOLUNTEER,,,,,,
16,2025,Anshika Pandey,6367633904,VOLUNTEER,,,,,,
DESIGN TEAM,,,,,,,,,,
1,2024,Srishti Jain,8619614892,COORDINATOR,,,,,,
2,2025,Ayushi Sharma,7014234047,VOLUNTEER,,,,,,
3,2025,Shreyansh Jangir,6350047132,VOLUNTEER,,,,,,
4,2025,Daksh Jain,8949318187,VOLUNTEER,,,,,,
5,2025,Paavani Sahu,7758944354,VOLUNTEER,,,,,,
6,2025,Bhavishya Kathpalia,7988868012,VOLUNTEER,,,,,,
7,2025,Tisha Garg,8875610074,VOLUNTEER,,,,,,`;

// Function to parse CSV data and organize by committee
export function parseTeamData(): CommitteeData[] {
  const lines = csvData.split('\n');
  const committees: CommitteeData[] = [];
  let currentCommittee: CommitteeData | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine === ',,,,,,,,,') continue;

    // Check if this is a committee header
    if (trimmedLine.includes('TEAM') || trimmedLine === 'ORGANIZING HEAD') {
      if (currentCommittee) {
        committees.push(currentCommittee);
      }
      
      let committeeName = trimmedLine.replace(/"/g, '').trim();
      if (committeeName === 'ORGANIZING HEAD') {
        committeeName = 'Organizing Head';
      } else if (committeeName.includes('DISCIPLINE TEAM')) {
        committeeName = 'Discipline';
      } else if (committeeName.includes('TECH & SUPPORT TEAM')) {
        committeeName = 'Technical';
      } else if (committeeName.includes('TRANSPORTATION TEAM')) {
        committeeName = 'Transport';
      } else if (committeeName.includes('PRIZE & CERTIFICATES TEAM')) {
        committeeName = 'Prize & Certificates';
      } else if (committeeName.includes('PHOTOGRAPHY TEAM')) {
        committeeName = 'Photography';
      } else if (committeeName.includes('STAGE & VENUE TEAM')) {
        committeeName = 'Stage & Venue';
      } else if (committeeName.includes('REGISTRATIONS TEAM')) {
        committeeName = 'Registrations';
      } else if (committeeName.includes('SOCIAL MEDIA TEAM')) {
        committeeName = 'Social Media';
      } else if (committeeName.includes('HOSPITALITY TEAM')) {
        committeeName = 'Hospitality';
      } else if (committeeName.includes('INTERNAL ARRANGEMENTS TEAM')) {
        committeeName = 'Internal Arrangements';
      } else if (committeeName.includes('CULTURAL EVENTS TEAM')) {
        committeeName = 'Cultural';
      } else if (committeeName.includes('DECOR TEAM')) {
        committeeName = 'Decor';
      } else if (committeeName.includes('SPONSORSHIP & PROMOTIONS TEAM')) {
        committeeName = 'Sponsorship & Promotion';
      } else if (committeeName.includes('MEDIA & REPORT TEAM')) {
        committeeName = 'Media & Report';
      } else if (committeeName.includes('ANCHORS TEAM')) {
        committeeName = 'anchors';
      } else if (committeeName.includes('DESIGN TEAM')) {
        committeeName = 'Design';
      }

      currentCommittee = {
        committeeName,
        members: []
      };
      continue;
    }

    // Parse member data
    if (currentCommittee && trimmedLine.includes(',')) {
      const parts = trimmedLine.split(',');
      if (parts.length >= 5 && parts[2] && parts[2].trim()) {
        const name = parts[2].trim();
        const batch = parts[1]?.trim() || '';
        const contact = parts[3]?.trim() || '';
        const role = parts[4]?.trim() || '';
        
        // Skip header rows
        if (name === 'Name' || name === 'S.No.' || !name) continue;

        currentCommittee.members.push({
          name,
          batch,
          contact,
          role,
          committee: currentCommittee.committeeName
        });
      }
    }
  }

  // Add the last committee
  if (currentCommittee) {
    committees.push(currentCommittee);
  }

  return committees;
}

// Function to get committee data by name
export function getCommitteeByName(committeeName: string): CommitteeData | null {
  const allCommittees = parseTeamData();
  return allCommittees.find(committee => 
    committee.committeeName.toLowerCase() === committeeName.toLowerCase()
  ) || null;
}

// Function to get all committee names
export function getAllCommitteeNames(): string[] {
  const allCommittees = parseTeamData();
  return allCommittees.map(committee => committee.committeeName);
}
