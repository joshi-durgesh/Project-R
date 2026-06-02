-- server/db/schema.sql

CREATE TABLE IF NOT EXISTS Users (
    user_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    region TEXT
);

CREATE TABLE IF NOT EXISTS Vehicles (
    vehicle_id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    make TEXT,
    model TEXT,
    year INTEGER,
    avg_daily_commute_km INTEGER,
    baseline_odometer INTEGER,
    last_updated_date TEXT,
    FOREIGN KEY(user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Maintenance_Schedules (
    schedule_id TEXT PRIMARY KEY,
    model_name TEXT,
    task_description TEXT,
    interval_km INTEGER,
    interval_months INTEGER
);

CREATE TABLE IF NOT EXISTS Insurance_Policies (
    policy_id TEXT PRIMARY KEY,
    vehicle_id TEXT,
    rc_number TEXT,
    policy_number TEXT,
    provider_name TEXT,
    expiry_date TEXT,
    coverage_type TEXT CHECK( coverage_type IN ('Third-Party', 'Comprehensive') ),
    has_zero_dep BOOLEAN,
    FOREIGN KEY(vehicle_id) REFERENCES Vehicles(vehicle_id)
);
