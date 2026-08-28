const { closeDb } = require('./init_db');
const { withTransaction } = require('./db_runtime');

function shiftDate(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function seedDatabase() {
  return withTransaction(async ({ run, get, all, exec }) => {
    const testDate = process.env.ARC_TEST_DATE || new Date().toISOString().slice(0, 10);
    const runtimeDate = new Date().toISOString().slice(0, 10);
    const nextDate = shiftDate(testDate, 1);
    const previousDate = shiftDate(testDate, -1);
    const upcomingDate = shiftDate(testDate, 30);
    const users = [
      ['registered_user', 'registered_user@example.com', '13800000010', 'Password123!', 'Registered Traveler', 'P20260010'],
      ['personal_center_user', 'personal_center_user@example.com', '13800000020', 'Password123!', 'Personal Center User', 'P20260020'],
      ['profile_user', 'profile_user@example.com', '13800000030', 'Password123!', 'Profile User', 'P20260030'],
      ['passenger_manager_user', 'passenger_manager_user@example.com', '13800000040', 'Password123!', 'Passenger Manager', 'P20260040'],
      ['bookable_user', 'bookable_user@example.com', '13800000050', 'Password123!', 'Bookable User', 'P20260050'],
      ['orders_empty_user', 'orders_empty_user@example.com', null, 'Password123!', 'Orders Empty User', 'P20260060'],
      ['orders_unpaid_user', 'orders_unpaid_user@example.com', null, 'Password123!', 'Orders Unpaid User', 'P20260070'],
      ['orders_upcoming_user', 'orders_upcoming_user@example.com', null, 'Password123!', 'Orders Upcoming User', 'P20260080'],
      ['orders_history_user', 'orders_history_user@example.com', null, 'Password123!', 'Orders History User', 'P20260090'],
      ['orders_cancelled_user', 'orders_cancelled_user@example.com', null, 'Password123!', 'Orders Cancelled User', 'P20260100'],
      ['reset_user', 'reset_user@example.com', null, 'Password123!', 'Reset User', 'P20260011'],
      ['username_taken', 'existing@example.com', null, 'Password123!', 'Existing User', 'P20260002'],
    ];
    for (const user of users) {
      await run(`INSERT OR IGNORE INTO users (username,email,mobile,password,name,passport_number,birth_date)
        VALUES (?,?,?,?,?,?,?)`, [...user, '1990-01-01']);
      await run(`UPDATE users
        SET email=?, mobile=?, password=?, name=?, passport_number=?, birth_date='1990-01-01'
        WHERE username=?`, [user[1], user[2], user[3], user[4], user[5], user[0]]);
    }
    const owner = await get('SELECT id FROM users WHERE username=?', ['passenger_manager_user']);
    const registered = await get('SELECT id FROM users WHERE username=?', ['registered_user']);
    const profile = await get('SELECT id FROM users WHERE username=?', ['profile_user']);
    const bookable = await get('SELECT id FROM users WHERE username=?', ['bookable_user']);
    await run('DELETE FROM passengers WHERE user_id=? AND is_owner=0', [owner.id]);
    const passenger = ['Passenger Example', 'P20269999', 'China', '2027-12-31', '2000-01-15', 'Female', 'passenger@example.com', '13800000040', 'Adult'];
    await run(`INSERT OR IGNORE INTO passengers
      (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type,is_owner)
      VALUES (?,?,?,?,?,?,?,?,?,?,1)`, [owner.id, 'Passenger Manager', 'P20260040', 'China', '2030-12-31', '1990-01-01', 'Male', 'passenger_manager_user@example.com', '13800000040', 'Adult']);
    await run('DELETE FROM passengers WHERE passport_number=?', [passenger[1]]);
    await run(`INSERT INTO passengers
      (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type,is_owner)
      VALUES (?,?,?,?,?,?,?,?,?,?,0)`, [owner.id, ...passenger]);
    const deletablePassengers = [
      ['Delete Passenger One', 'P20269997', 'China', '2028-06-30', '1995-03-12', 'Male', 'delete.one@example.com', '13800000041', 'Adult'],
      ['Delete Passenger Two', 'P20269998', 'China', '2029-08-31', '1998-09-23', 'Female', 'delete.two@example.com', '13800000042', 'Adult'],
    ];
    for (const deletable of deletablePassengers) {
      await run('DELETE FROM passengers WHERE passport_number=?', [deletable[1]]);
      await run(`INSERT INTO passengers
        (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type,is_owner)
        VALUES (?,?,?,?,?,?,?,?,?,?,0)`, [owner.id, ...deletable]);
    }
    await run(`INSERT OR IGNORE INTO passengers
      (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type,is_owner)
      VALUES (?,?,?,?,?,?,?,?,?,?,1)`, [registered.id, 'Registered Traveler', 'P20260010', 'China', '2030-12-31', '1990-01-01', 'Male', 'registered_user@example.com', '13800000010', 'Adult']);
    await run(`INSERT OR IGNORE INTO passengers
      (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type,is_owner)
      VALUES (?,?,?,?,?,?,?,?,?,?,1)`, [profile.id, 'Profile User', 'P20260030', 'China', '2030-12-31', '1990-01-01', 'Male', 'profile_user@example.com', '13800000030', 'Adult']);
    await run(`INSERT OR IGNORE INTO passengers
      (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type,is_owner)
      VALUES (?,?,?,?,?,?,?,?,?,?,1)`, [bookable.id, 'Bookable User', 'P20260050', 'China', '2030-12-31', '1990-01-01', 'Male', 'bookable_user@example.com', '13800000050', 'Adult']);
    await run(`INSERT OR IGNORE INTO passengers
      (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type,is_owner)
      VALUES (?,?,?,?,?,?,?,?,?,?,0)`, [bookable.id, 'Bookable Companion', 'P20260051', 'China', '2030-12-31', '1992-02-02', 'Female', 'bookable.companion@example.com', '13800000051', 'Adult']);
    const stations = [
      ['Shanghai', 'Shanghai'], ['Shanghai', 'Shanghai Hongqiao'], ['Beijing', 'Beijing'], ['Beijing', 'Beijing South'],
      ['Yancheng', 'Yancheng'], ['Lhasa', 'Lhasa'],
    ];
    for (const station of stations) await run('INSERT OR IGNORE INTO stations (city,station_name) VALUES (?,?)', station);
    const guideItems = [
      ['Ticketing', 'How to book tickets online?', 'Search a route, choose a train and ticket class, select passengers, then submit and confirm the order.'],
      ['Ticketing', 'What ID documents are accepted?', 'Foreign passengers can purchase real-name tickets with a valid passport or another supported identity document.'],
      ['Ticketing', 'What is real-name ticketing?', 'Railway operation companies use real-name ticketing to protect passenger safety and service order.'],
      ['Ticketing', 'How many kinds of tickets are there?', 'Currently, both E-tickets and paper tickets are on sale.'],
      ['Endorsement and refund', 'How to change or refund tickets?', 'Passengers can change or refund tickets before departure, subject to current railway service rules.'],
      ['Endorsement and refund', 'What is endorsement?', 'Endorsement means changing the date, train number, seat type or destination according to applicable rules.'],
      ['Endorsement and refund', 'What are the rules of ticket endorsement?', 'Check the departure time and available trains before confirming an endorsement.'],
      ['Endorsement and refund', 'How is a refund calculated?', 'Refund fees depend on the time between the refund request and scheduled departure.'],
      ['Miscellaneous', 'How to check train status?', 'Search by train number or route to see current departure and arrival information.'],
      ['Miscellaneous', 'How to use 12306 mobile app?', 'Use the official mobile application to search routes, manage passengers and review orders.'],
      ['Miscellaneous', 'How can I contact support?', 'The Contact us entry provides service assistance for common booking questions.'],
      ['Miscellaneous', 'What documents are accepted?', 'A valid passport or other supported identity document is required for real-name travel.'],
    ];
    for (const item of guideItems) await run('INSERT OR IGNORE INTO guide_items (category,question,detail) VALUES (?,?,?)', item);
    const managedTrainNumbers = ['G532', 'G548', 'G2', 'G4', 'T110', 'G101', 'G102', 'G103', 'T109', 'G1001', 'G1001-H', 'D2136', 'Z165', 'G1818', 'Z164'];
    await run(`DELETE FROM orders WHERE user_id IN (
      SELECT id FROM users WHERE username IN ('orders_empty_user','orders_unpaid_user','orders_upcoming_user','orders_history_user','orders_cancelled_user','bookable_user')
    )`);
    await run(`DELETE FROM trains WHERE train_no IN (${managedTrainNumbers.map(() => '?').join(',')})`, managedTrainNumbers);
    await run("DELETE FROM trains WHERE from_city='Yancheng' AND to_city='Lhasa'");
    const trains = [
      ['G532','Shanghai','Beijing','Shanghaihongqiao','Beijingnan',testDate,'06:31','12:18',347,'G/C/D',1870,1,967,8,576,0,576,20],
      ['G548','Shanghai','Beijing','Shanghaihongqiao','Beijingnan',nextDate,'06:32','12:39',367,'G/C/D',2067,12,1025,4,617,20,617,20],
      ['G2','Shanghai','Beijing','Shanghaihongqiao','Beijingnan',testDate,'06:43','11:32',289,'G/C/D',2315,5,1058,0,661,12,661,20],
      ['G4','Shanghai','Beijing','Shanghai','Beijingnan',nextDate,'07:00','11:37',277,'G/C/D',2180,3,978,0,576,10,576,20],
      ['T110','Shanghai','Beijing','Shanghai','Beijing',testDate,'20:10','10:30',860,'Other',420,4,300,10,200,20,200,30],
      ['G101','Beijing','Shanghai','Beijingnan','Shanghaihongqiao',testDate,'07:12','12:08',296,'G/C/D',1870,6,967,12,576,18,576,30],
      ...(runtimeDate === testDate ? [] : [['G102','Beijing','Shanghai','Beijingnan','Shanghaihongqiao',runtimeDate,'07:20','12:16',296,'G/C/D',1870,6,967,12,576,18,576,30]]),
      ['G103','Beijing','Shanghai','Beijingnan','Shanghaihongqiao',nextDate,'08:05','13:11',306,'G/C/D',2067,8,1025,10,617,20,617,30],
      ['T109','Beijing','Shanghai','Beijing','Shanghai',testDate,'19:42','11:18',936,'Other',420,4,300,10,200,20,200,30],
      ['G1001','Beijing','Shanghai','Beijingnan','Shanghaihongqiao',upcomingDate,'06:50','12:00',310,'G/C/D',1870,6,967,12,576,18,576,30],
      ['G1001-H','Shanghai','Beijing','Shanghaihongqiao','Beijingnan',previousDate,'07:10','12:20',310,'G/C/D',1870,6,967,12,576,20,576,30],
      ['D2136','Yancheng','Xuzhou','Yancheng','Xuzhou',testDate,'07:20','09:05',105,'Other',454,2,300,8,126,20,80,30],
      ['Z165','Xuzhou','Lhasa','Xuzhou','Lhasa',testDate,'10:10','16:19',1809,'Other',800,2,500,8,328,20,200,30],
      ['G1818','Yancheng','Nanjing','Yancheng','Nanjing',testDate,'09:12','11:03',111,'G/C/D',534,2,400,8,178,20,100,30],
      ['Z164','Nanjing','Lhasa','Nanjing','Lhasa',testDate,'12:30','18:49',1819,'Other',850,2,520,8,356,20,220,30],
    ];
    for (const train of trains) {
      await run(`INSERT OR IGNORE INTO trains
        (train_no,from_city,to_city,from_station,to_station,travel_date,departure_time,arrival_time,duration_minutes,train_type,business_price,business_seats,first_price,first_seats,second_price,second_seats,standing_price,standing_seats)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, train);
    }
    const usersWithOrders = {
      orders_unpaid_user: 'unpaid', orders_upcoming_user: 'paid', orders_history_user: 'refunded', orders_cancelled_user: 'cancelled',
    };
    for (const [username, status] of Object.entries(usersWithOrders)) {
      const user = await get('SELECT id FROM users WHERE username=?', [username]);
      const trainNo = username === 'orders_upcoming_user' ? 'G1001' : username === 'orders_history_user' ? 'G1001-H' : 'G532';
      const train = await get('SELECT id FROM trains WHERE train_no=?', [trainNo]);
      const totalPrice = 576;
      const refundDeadline = status === 'paid' ? `${upcomingDate}T06:50:00` : null;
      await run(`INSERT OR IGNORE INTO orders (order_number,user_id,train_id,status,total_price,passenger_json,refund_deadline)
        VALUES (?,?,?,?,?,?,?)`, [`${username}-${trainNo}`, user.id, train.id, status, totalPrice, JSON.stringify([{name: 'Passenger Example', seatType: 'Second-class seat', ticketType: 'Adult', price: totalPrice}]), refundDeadline]);
    }
  });
}

if (require.main === module) {
  seedDatabase()
    .then(() => closeDb())
    .catch((error) => {
      console.error('Database seed failed:', error);
      process.exitCode = 1;
    });
}

module.exports = seedDatabase;
module.exports.seedDatabase = seedDatabase;
module.exports.seed = seedDatabase;
