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
,,Diya Garg,,OH,,,,,,
DISCIPLINE TEAM,,,,,,,,,,
,,Rahul Verma,,CORE,,,,,,
,,Kriti Gupta,,CORE,,,,,,
,,Kunal Kasliwal,,COORDINATOR,,,,,,
,,Ashlesha Sharma,,COORDINATOR,,,,,,
,,Kartik Sharma,,COORDINATOR,,,,,,
,,Parul Swami,,COORDINATOR,,,,,,
,,Satvik Agrawal,,COORDINATOR,,,,,,
,,Shikha Sharma,,COORDINATOR,,,,,,
,,Lakshit Pareek,,COORDINATOR,,,,,,
,,Monu Sharma,,COORDINATOR,,,,,,
,,Divyansh Choudhary,,COORDINATOR,,,,,,
,,Aditi Punia,,VOLUNTEER,,,,,,
,,Aman Anchaliya,,VOLUNTEER,,,,,,
,,Aman Choudhary,,VOLUNTEER,,,,,,
,,Ayush Gadwal,,VOLUNTEER,,,,,,
,,Bhavya Doshi,,VOLUNTEER,,,,,,
,,Bhavya Gupta,,VOLUNTEER,,,,,,
,,Bhavya Raj Singh Sarangdevot,,VOLUNTEER,,,,,,
,,Vikas Saran,,VOLUNTEER,,,,,,
,,Dharam Singh Choudhary,,VOLUNTEER,,,,,,
,,Dishika Pancholi,,VOLUNTEER,,,,,,
,,Divit Chaturvedi,,VOLUNTEER,,,,,,
,,Divyansh Chopra,,VOLUNTEER,,,,,,
,,Garima Maheshwari,,VOLUNTEER,,,,,,
,,Hardik Kumawat,,VOLUNTEER,,,,,,
,,Hemangi Sancheti,,VOLUNTEER,,,,,,
,,Heramb Sharma,,VOLUNTEER,,,,,,
,,Himani Menghani,,VOLUNTEER,,,,,,
,,Keshav Singh Shekhawat,,VOLUNTEER,,,,,,
,,Khanak Jain,,VOLUNTEER,,,,,,
,,Koushal Jangir,,VOLUNTEER,,,,,,
,,Naresh Roj,,VOLUNTEER,,,,,,
,,Navya Sharma,,VOLUNTEER,,,,,,
,,Parihaan Kabra,,VOLUNTEER,,,,,,
,,Purvi Naruka,,VOLUNTEER,,,,,,
,,Raghav Sharma,,VOLUNTEER,,,,,,
,,Raghuraj Jangid,,VOLUNTEER,,,,,,
,,Rishabh Choudhary,,VOLUNTEER,,,,,,
,,Shouryaveer Bishnoi,,VOLUNTEER,,,,,,
,,Tanishq Daiya,,VOLUNTEER,,,,,,
,,Tanmay Sharma,,VOLUNTEER,,,,,,
,,Tarun Saran,,VOLUNTEER,,,,,,
,,Tarushi,,VOLUNTEER,,,,,,
,,Vaibhav Charan,,VOLUNTEER,,,,,,
,,Yashsvi Bothra,,VOLUNTEER,,,,,,
,,Yatharth Chaturvedi,,VOLUNTEER,,,,,,
,,Navy Bhatra,,VOLUNTEER,,,,,,
,,Chanchal Karanani,,VOLUNTEER,,,,,,
TECH & SUPPORT TEAM,,,,,,,,,,
,,Suryaansh Sharma,,CORE,,,,,,
,,Devam Gupta,,COORDINATOR,,,,,,
,,Ayush Sharma,,COORDINATOR,,,,,,
,,Atharv Mehrotra,,COORDINATOR,,,,,,
,,Somay Agarwal,,COORDINATOR,,,,,,
,,Yash Mishra,,COORDINATOR,,,,,,
,,Prateek Saxena,,COORDINATOR,,,,,,
,,Aman Pratap Singh,,COORDINATOR,,,,,,
,,Rashi Katiyar,,VOLUNTEER,,,,,,
,,Rudrapal Singh,,VOLUNTEER,,,,,,
,,Raghuraj Singh Shekhawat,,VOLUNTEER,,,,,,
,,Lakshay,,VOLUNTEER,,,,,,
,,Shubh Dixit,,VOLUNTEER,,,,,,
,,Srinivasa Sangeeth,,VOLUNTEER,,,,,,
,,Priyanshi Agnani,,VOLUNTEER,,,,,,
,,Kanika Suthar,,VOLUNTEER,,,,,,
,,Kajal Agarwal,,VOLUNTEER,,,,,,
,,Chandan Prit Singh,,VOLUNTEER,,,,,,
,,Parth Dhoot,,VOLUNTEER,,,,,,
,,Aditi Sharma,,VOLUNTEER,,,,,,
,,Pradhuman Thanvi,,VOLUNTEER,,,,,,
,,Siya Sharma,,VOLUNTEER,,,,,,
,,Mansi Somani,,VOLUNTEER,,,,,,
,,Ashutosh Yadav,,VOLUNTEER,,,,,,
,,Kavita Sharma,,VOLUNTEER,,,,,,
TRANSPORTATION TEAM,,,,,,,,,,
,,Anmol Sahu,,CORE,,,,,,
,,Harshveer Singh Rathore,,COORDINATOR,,,,,,
,,Vansh Sharma,,COORDINATOR,,,,,,
,,Bhanu Upadhyay,,VOLUNTEER,,,,,,
,,Agamya Singh Chauhan,,VOLUNTEER,,,,,,
,,Vaibhav Sharma,,VOLUNTEER,,,,,,
,,Samarth Singh,,VOLUNTEER,,,,,,
PRIZE & CERTIFICATES TEAM,,,,,,,,,,
,,Tanveer Kanderiya,,CORE,,,,,,
,,Sahil Yadav,,COORDINATOR,,,,,,
,,Shaik Areesh,,COORDINATOR,,,,,,
,,Lokesh Sharma,,COORDINATOR,,,,,,
,,Priyanshi Mehta,,COORDINATOR,,,,,,
,,Avika Soni,,VOLUNTEER,,,,,,
,,Prashant Sharma,,VOLUNTEER,,,,,,
,,Tarun Kumar,,VOLUNTEER,,,,,,
,,Gurseerat Kaur,,VOLUNTEER,,,,,,
,,Divyansh Pratap Singh,,VOLUNTEER,,,,,,
,,Nikita,,VOLUNTEER,,,,,,
,,Rashi Chandnani,,VOLUNTEER,,,,,,
,,Shivia Rawat,,VOLUNTEER,,,,,,
,,Atharv Mandal,,VOLUNTEER,,,,,,
,,Ruchi Choudhary,,VOLUNTEER,,,,,,
,,Arjun Giri,,VOLUNTEER,,,,,,
,,Sneh Toshniwal,,VOLUNTEER,,,,,,
PHOTOGRAPHY TEAM,,,,,,,,,,
,,Shorya Prajapat,,CORE,,,,,,
,,Ekansh Saraswat,,CORE,,,,,,
,,Roshan Jangir,,COORDINATOR,,,,,,
,,Kartik Singh,,COORDINATOR,,,,,,
,,Aryan Jain,,COORDINATOR,,,,,,
,,Devansh Srivastava,,COORDINATOR,,,,,,
,,Sunay Kundalwal,,VOLUNTEER,,,,,,
,,Vansh Vaibhav Singh,,VOLUNTEER,,,,,,
,,Daksh Shukla,,VOLUNTEER,,,,,,
,,Katyayani Rathore,,VOLUNTEER,,,,,,
,,Himani Saraf,,VOLUNTEER,,,,,,
,,Niharika Chauhan,,VOLUNTEER,,,,,,
,,Arham Bothra,,VOLUNTEER,,,,,,
,,Yogant Gupta,,VOLUNTEER,,,,,,
,,Agreema Gauttam,,VOLUNTEER,,,,,,
,,Muskan,,VOLUNTEER,,,,,,
,,Harshita Harchandani,,VOLUNTEER,,,,,,
,,Riddhi Sharma,,VOLUNTEER,,,,,,
,,Raj Jasoria,,VOLUNTEER,,,,,,
,,Aditya Vyas,,VOLUNTEER,,,,,,
,,Krish Bhola,,VOLUNTEER,,,,,,
STAGE & VENUE TEAM,,,,,,,,,,
,,Suryansh Khandelwal,,CORE,,,,,,
,,Nikita Kumawat,,COORDINATOR,,,,,,
,,Aditya Somani,,COORDINATOR,,,,,,
,,Yug Jain,,COORDINATOR,,,,,,
,,Aman Gupta,,COORDINATOR,,,,,,
,,Bhavya Bang,,COORDINATOR,,,,,,
,,Garv Sharma,,COORDINATOR,,,,,,
,,Tanvi Gupta,,VOLUNTEER,,,,,,
,,Pari Nahata,,VOLUNTEER,,,,,,
,,Nawya Dusad,,VOLUNTEER,,,,,,
,,Sanskriti Gehlot,,VOLUNTEER,,,,,,
,,Chirag Kumar,,VOLUNTEER,,,,,,
,,Nandani Rajawat,,VOLUNTEER,,,,,,
,,Harshwardhan,,VOLUNTEER,,,,,,
,,Gaurav Sharma,,VOLUNTEER,,,,,,
,,Purvi Jain,,VOLUNTEER,,,,,,
,,Ayush Jaiswal,,VOLUNTEER,,,,,,
,,Anuj Soni,,VOLUNTEER,,,,,,
,,Ritik Sharma,,VOLUNTEER,,,,,,
,,G.vishwaroopachary,,VOLUNTEER,,,,,,
REGISTRATIONS TEAM,,,,,,,,,,
,,Ayushi Kabra,,CORE,,,,,,
,,Jayash Gahlot,,CORE,,,,,,
,,Rashi Lunawat,,COORDINATOR,,,,,,
,,Ashmit Sharma,,COORDINATOR,,,,,,
,,Shivam Lakshkar,,COORDINATOR,,,,,,
,,Saumya Puri,,COORDINATOR,,,,,,
,,Monika Khichar,,COORDINATOR,,,,,,
,,Ankit Joshi,,COORDINATOR,,,,,,
,,Atashi Kashyap,,COORDINATOR,,,,,,
,,Ashmi Sharma,,COORDINATOR,,,,,,
,,Anirudh Choudhary,,VOLUNTEER,,,,,,
,,Droni Sehgal,,VOLUNTEER,,,,,,
,,Vidhaan P Shah,,VOLUNTEER,,,,,,
,,Anandi Kolapkar,,VOLUNTEER,,,,,,
,,Abhishek,,VOLUNTEER,,,,,,
,,Nandini Shah,,VOLUNTEER,,,,,,
,,Darshita Jain,,VOLUNTEER,,,,,,
,,Naveen Tholiya,,VOLUNTEER,,,,,,
,,Yash Gill,,VOLUNTEER,,,,,,
,,Yuvraj Singh Rathore,,VOLUNTEER,,,,,,
,,Purvee Dudheria,,VOLUNTEER,,,,,,
,,Shreshtha Sharma,,VOLUNTEER,,,,,,
,,Pranjal Jangid,,VOLUNTEER,,,,,,
,,Harshul Agarwal,,VOLUNTEER,,,,,,
,,Akshara Saini,,VOLUNTEER,,,,,,
,,Priya Sahu,,VOLUNTEER,,,,,,
SOCIAL MEDIA TEAM,,,,,,,,,,
,,Vandan P. Shah,,CORE,,,,,,
,,Aditya Nayak,,COORDINATOR,,,,,,
,,Akshara Gupta,,COORDINATOR,,,,,,
,,Deepanshu Singh,,COORDINATOR,,,,,,
,,Vaibhav Khandelwal,,COORDINATOR,,,,,,
,,Manvi Gurjar,,COORDINATOR,,,,,,
,,Priyanshi Singhvi,,VOLUNTEER,,,,,,
,,Aman Kumawat,,VOLUNTEER,,,,,,
,,Nikita Bhatia,,VOLUNTEER,,,,,,
,,Minal Jain,,VOLUNTEER,,,,,,
,,Chirag Negi,,VOLUNTEER,,,,,,
,,Nandini Mittal,,VOLUNTEER,,,,,,
,,Padmini Singh,,VOLUNTEER,,,,,,
,,Gauri Singhi,,VOLUNTEER,,,,,,
,,Aditi Agarwal,,VOLUNTEER,,,,,,
,,Kaushal Malvi,,VOLUNTEER,,,,,,
HOSPITALITY TEAM,,,,,,,,,,
,,Aayushi Meel,,CORE,,,,,,
,,Nehal Khandelwal,,COORDINATOR,,,,,,
,,Astha Barnwal,,COORDINATOR,,,,,,
,,Adityavardhan Singh Chauhan,,COORDINATOR,,,,,,
,,Tanik Gupta,,COORDINATOR,,,,,,
,,Chailsi Jain,,COORDINATOR,,,,,,
,,Garima Sharma,,VOLUNTEER,,,,,,
,,Vagisha Singh Kapasia,,VOLUNTEER,,,,,,
,,Mrudula Chinke,,VOLUNTEER,,,,,,
,,Prince Soni,,VOLUNTEER,,,,,,
,,Prakhar Jain,,VOLUNTEER,,,,,,
,,Pratham Lalwani,,VOLUNTEER,,,,,,
,,Aalap Goswami,,VOLUNTEER,,,,,,
,,Vansh Bhatia,,VOLUNTEER,,,,,,
,,Kavya Gupta,,VOLUNTEER,,,,,,
,,Nayana,,VOLUNTEER,,,,,,
INTERNAL ARRANGEMENTS TEAM,,,,,,,,,,
,,Lakshay Khandelwal,,CORE,,,,,,
,,Pulkit Dosi,,COORDINATOR,,,,,,
,,Riya Chauhan,,COORDINATOR,,,,,,
,,Aryan Pamecha,,COORDINATOR,,,,,,
,,Shivika Kesharwani,,COORDINATOR,,,,,,
,,Aryan Gupta,,COORDINATOR,,,,,,
,,Kakul Goyal,,COORDINATOR,,,,,,
,,Dhananjay Sharma,,COORDINATOR,,,,,,
,,Jitesh Khandelwal,,VOLUNTEER,,,,,,
,,Akarsh Pareek,,VOLUNTEER,,,,,,
,,Charvi Sharma,,VOLUNTEER,,,,,,
,,Anvi Vashist,,VOLUNTEER,,,,,,
,,Rajan Kumawat,,VOLUNTEER,,,,,,
,,Amandeep Singh Rathore,,VOLUNTEER,,,,,,
,,Mohammed Ozair Shah,,VOLUNTEER,,,,,,
,,Jitendra,,VOLUNTEER,,,,,,
,,Riya Sharma,,VOLUNTEER,,,,,,
,,Varun Teja Ankarla,,VOLUNTEER,,,,,,
,,Shreyansh Mishra,,VOLUNTEER,,,,,,
,,Ashutosh Gupta,,VOLUNTEER,,,,,,
,,Risha Saini,,VOLUNTEER,,,,,,
,,Shambhavi Singh,,VOLUNTEER,,,,,,
CULTURAL EVENTS TEAM,,,,,,,,,,
,,Satvick Vaid,,CORE,,,,,,
,,Adhya Mittal,,COORDINATOR,,,,,,
,,Jheel Jain,,COORDINATOR,,,,,,
,,Pratigya Bomb,,COORDINATOR,,,,,,
,,Nehal Mittal,,COORDINATOR,,,,,,
,,Mayank Soni,,COORDINATOR,,,,,,
,,Anurika A,,COORDINATOR,,,,,,
,,Mansi,,COORDINATOR,,,,,,
,,Mayank Shankar Pathak,,COORDINATOR,,,,,,
,,Madhav Garg,,COORDINATOR,,,,,,
,,Gourang Tak,,COORDINATOR,,,,,,
,,Pragyansh Mishra,,COORDINATOR,,,,,,
,,Akshat Bisht,,VOLUNTEER,,,,,,
,,Anubha Sharma,,VOLUNTEER,,,,,,
,,Arnav Sharma,,VOLUNTEER,,,,,,
,,Chelsy Tanwar,,VOLUNTEER,,,,,,
,,Dev Gautam,,VOLUNTEER,,,,,,
,,Hardik Yadav,,VOLUNTEER,,,,,,
,,Megh Kedia,,VOLUNTEER,,,,,,
,,Saanchi Vijayvergia,,VOLUNTEER,,,,,,
,,Sakshi Jain,,VOLUNTEER,,,,,,
,,Shivansh Sharma,,VOLUNTEER,,,,,,
,,Aadrika Roy,,VOLUNTEER,,,,,,
,,Ankush Panda,,VOLUNTEER,,,,,,
,,Arshey Rai,,VOLUNTEER,,,,,,
,,Atharv Mandal,,VOLUNTEER,,,,,,
,,Dishika Sharma,,VOLUNTEER,,,,,,
,,Divya Malik,,VOLUNTEER,,,,,,
,,Jiya Dhanwani,,VOLUNTEER,,,,,,
,,Madhu Swami,,VOLUNTEER,,,,,,
,,Mallareddi Charan,,VOLUNTEER,,,,,,
,,Naina Dayaramani,,VOLUNTEER,,,,,,
,,Nancy Sain,,VOLUNTEER,,,,,,
,,Prekshya Sharma,,VOLUNTEER,,,,,,
,,Rahul Gorani,,VOLUNTEER,,,,,,
,,Samriddhi Singh,,VOLUNTEER,,,,,,
,,Samridhi Singh,,VOLUNTEER,,,,,,
,,Saumya Agarwal,,VOLUNTEER,,,,,,
,,Eishit Gupta,,VOLUNTEER,,,,,,
,,Naman Mahlawat,,VOLUNTEER,,,,,,
DECOR TEAM,,,,,,,,,,
,,Jinal Lodha,,CORE,,,,,,
,,Jigeesha Agarawal,,CORE,,,,,,
,,Ayaan Mathur,,COORDINATOR,,,,,,
,,Bhawesh Chandnani,,COORDINATOR,,,,,,
,,Chahak Agarwal,,COORDINATOR,,,,,,
,,Kartik Phulwari,,COORDINATOR,,,,,,
,,Aayushi Kaushik,,VOLUNTEER,,,,,,
,,Abhirama K Sreyas,,VOLUNTEER,,,,,,
,,Akshat Murarka,,VOLUNTEER,,,,,,
,,Aarna Agarwal,,VOLUNTEER,,,,,,
,,Arihant Jain,,VOLUNTEER,,,,,,
,,Arunil Jain,,VOLUNTEER,,,,,,
,,Aviral Sherawat,,VOLUNTEER,,,,,,
,,Avnika Vyas,,VOLUNTEER,,,,,,
,,Bhumika Daharwal,,VOLUNTEER,,,,,,
,,Yuvraj Singh,,VOLUNTEER,,,,,,
,,Drashya Jain,,VOLUNTEER,,,,,,
,,Lakshita Tanwar,,VOLUNTEER,,,,,,
,,Lakshya Gupta,,VOLUNTEER,,,,,,
,,Mahi Tripathi,,VOLUNTEER,,,,,,
,,Mrinal Khandal,,VOLUNTEER,,,,,,
,,Pratistha Chechani,,VOLUNTEER,,,,,,
,,Ridhwik Tailor,,VOLUNTEER,,,,,,
,,Shabd Srivastava,,VOLUNTEER,,,,,,
,,Udit Mishra,,VOLUNTEER,,,,,,
,,Yashvardhan Singh,,VOLUNTEER,,,,,,
SPONSORSHIP & PROMOTIONS TEAM,,,,,,,,,,
,,Naman Shukla,,CORE,,,,,,
,,Rishika Sharma,,COORDINATOR,,,,,,
,,Harshita Kanwar,,COORDINATOR,,,,,,
,,Smile Chhabra,,COORDINATOR,,,,,,
,,Avni Gupta,,COORDINATOR,,,,,,
,,Adipoojya Mehra,,VOLUNTEER,,,,,,
,,Manan Sharma,,VOLUNTEER,,,,,,
,,Chintan Sharma,,VOLUNTEER,,,,,,
,,Bhavisha Sabani,,VOLUNTEER,,,,,,
,,Ghyan Chechani,,VOLUNTEER,,,,,,
,,Pranjal Jain,,VOLUNTEER,,,,,,
,,Sanchi Dhoopia,,VOLUNTEER,,,,,,
,,Jainam Jain,,VOLUNTEER,,,,,,
,,Shubhangi Bhanawat,,VOLUNTEER,,,,,,
,,Rishi Jangid,,VOLUNTEER,,,,,,
,,Diya Shah,,VOLUNTEER,,,,,,
MEDIA & REPORT TEAM,,,,,,,,,,
,,Prabal Agarwal,,CORE,,,,,,
,,Nayna Dubey,,COORDINATOR,,,,,,
,,Parineeta Jain,,COORDINATOR,,,,,,
,,Nidhish Tripathi,,COORDINATOR,,,,,,
,,Cheshta Kulshrestha,,COORDINATOR,,,,,,
,,Anshumann Dhaka,,VOLUNTEER,,,,,,
,,Pratiki Agarwal,,VOLUNTEER,,,,,,
,,Gouranshi Sharma,,VOLUNTEER,,,,,,
,,Anukriti Choudhary,,VOLUNTEER,,,,,,
,,Aditi Sharma,,VOLUNTEER,,,,,,
,,Komal Verma,,VOLUNTEER,,,,,,
,,Arshiyaa Yadav,,VOLUNTEER,,,,,,
,,R.Varshitha Reddy,,VOLUNTEER,,,,,,
,,Garvishtha Asnani,,VOLUNTEER,,,,,,
,,Mradul Saxena,,VOLUNTEER,,,,,,
ANCHORS TEAM,,,,,,,,,,
,,Chahat Khandelwal,,CORE,,,,,,
,,Akshali Srivastava,,COORDINATOR,,,,,,
,,Nitya Manglani,,COORDINATOR,,,,,,
,,Swadha Saxena,,COORDINATOR,,,,,,
,,Laksh Sharma,,COORDINATOR,,,,,,
,,Rusham,,VOLUNTEER,,,,,,
,,Avneesh Kumar Dubey,,VOLUNTEER,,,,,,
,,Himanshu,,VOLUNTEER,,,,,,
,,Dhanyashree Sen,,VOLUNTEER,,,,,,
,,Abigail,,VOLUNTEER,,,,,,
,,Daksh Kumar,,VOLUNTEER,,,,,,
,,Gurseerat Kaur,,VOLUNTEER,,,,,,
,,Vaibhav Khandelwal,,VOLUNTEER,,,,,,
,,Faizi Ali,,VOLUNTEER,,,,,,
,,Mansi,,VOLUNTEER,,,,,,
,,Anushri Falor,,VOLUNTEER,,,,,,
,,Shubhi Jain,,VOLUNTEER,,,,,,
,,Garvit Agrawal,,VOLUNTEER,,,,,,
,,Anshika Pandey,,VOLUNTEER,,,,,,
DESIGN TEAM,,,,,,,,,,
,,Srishti Jain,,COORDINATOR,,,,,,
,,Shreyansh Jangir,,VOLUNTEER,,,,,,
,,Paavani Sahu,,VOLUNTEER,,,,,,
,,Tisha Garg,,VOLUNTEER,,,,,,`;

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
