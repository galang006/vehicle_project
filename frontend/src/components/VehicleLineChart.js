// src/components/VehicleLineChart.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VehicleLineChart = () => {
    const search = useLocation().search;
    const loc = new URLSearchParams(search).get('loc');
    const [vehicleData, setVehicleData] = useState([]);

    useEffect(() => {
        const fetchVehicleData = () => {
            // Ambil data dari API
            axios.get(`http://127.0.0.1:5000/vehicle_count?loc=${loc}`)
                .then(response => {
                    console.log(response.data); // Tambahkan ini untuk debug
                    const formattedData = response.data.reduce((acc, item) => {
                        const timestamp = item.timestamp;

                        // Buat objek jika belum ada untuk timestamp ini
                        if (!acc[timestamp]) {
                            acc[timestamp] = {
                                name: timestamp,
                                bus: 0,
                                car: 0,
                                motorcycle: 0,
                                truck: 0,
                            };
                        }

                        // Tambah jumlah kendaraan IN dari semua arah
                        acc[timestamp].bus += item.Class === 'bus' ? (item['Nord In'] || 0) + (item['East In'] || 0) + (item['South In'] || 0) + (item['West In'] || 0) : 0;
                        acc[timestamp].car += item.Class === 'car' ? (item['Nord In'] || 0) + (item['East In'] || 0) + (item['South In'] || 0) + (item['West In'] || 0) : 0;
                        acc[timestamp].motorcycle += item.Class === 'motorcycle' ? (item['Nord In'] || 0) + (item['East In'] || 0) + (item['South In'] || 0) + (item['West In'] || 0) : 0;
                        acc[timestamp].truck += item.Class === 'truck' ? (item['Nord In'] || 0) + (item['East In'] || 0) + (item['South In'] || 0) + (item['West In'] || 0) : 0;

                        return acc;
                    }, {});

                    // Ubah objek menjadi array dan pastikan setiap kendaraan memiliki nilai
                    const dataArray = Object.values(formattedData).map(item => ({
                        ...item,
                        bus: item.bus || 0,
                        car: item.car || 0,
                        motorcycle: item.motorcycle || 0,
                        truck: item.truck || 0,
                    }));

                    // Jika dataArray kosong, tambahkan entri default
                    if (dataArray.length === 0) {
                        dataArray.push({
                            name: new Date().toISOString(),
                            bus: 0,
                            car: 0,
                            motorcycle: 0,
                            truck: 0,
                        });
                    }

                    setVehicleData(dataArray);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        fetchVehicleData();

        const intervalId = setInterval(fetchVehicleData, 300000);

        return () => clearInterval(intervalId);
    }, [loc]);

    return (
        <div style={{ width: '100%', height: 400, padding: '20px', marginBottom: '20px' }}>
            <h2>Vehicle Count by Time</h2>
            <ResponsiveContainer width="95%" height={300}>
                <LineChart data={vehicleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bus" stroke="#8884d8" name="Bus" />
                    <Line type="monotone" dataKey="car" stroke="#82ca9d" name="Car" />
                    <Line type="monotone" dataKey="motorcycle" stroke="#ffc658" name="Motorcycle" />
                    <Line type="monotone" dataKey="truck" stroke="#ff7300" name="Truck" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VehicleLineChart;
