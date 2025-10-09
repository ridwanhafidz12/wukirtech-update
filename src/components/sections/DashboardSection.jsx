import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Sun, Thermometer, Users, ShoppingBag } from 'lucide-react';

const initialVisitorData = [
  { name: '2020', pengunjung: 524.57 },
  { name: '2021', pengunjung: 613.3 },
  { name: '2022', pengunjung: 734.86 },
  { name: '2023', pengunjung: 839.67 },
  { name: '2024', pengunjung: 1021.08 },
];

const umkmData = [
    { name: 'Kerajinan', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Kuliner', value: 35, color: 'hsl(80, 70%, 50%)' },
    { name: 'Jasa & Akomodasi', value: 15, color: 'hsl(140, 50%, 60%)' },
    { name: 'Agrowisata', value: 12, color: 'hsl(40, 60%, 60%)' },
];
const totalUmkm = umkmData.reduce((sum, item) => sum + item.value, 0);


const WeatherWidget = () => {
  return (
    <motion.div 
      className="bg-card/50 backdrop-blur-md border border-border/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <p className="font-semibold text-muted-foreground mb-2">Cuaca di Wukirsari</p>
      <div className="flex items-center gap-4 my-4">
        <Sun className="w-16 h-16 text-yellow-400" />
        <div>
          <p className="text-5xl font-bold text-foreground">28°C</p>
          <p className="text-lg text-primary font-semibold">Cerah</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
        <Thermometer className="w-4 h-4" />
        <span>Terasa seperti 31°C</span>
      </div>
    </motion.div>
  );
};

const VisitorChart = () => {
  const [data, setData] = useState(initialVisitorData);

  // Hapus interval update data karena ini data tahunan statis
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setData(currentData => {
  //       const newData = [...currentData];
  //       const lastDataPoint = newData[newData.length - 1];
  //       const newVisitorCount = Math.max(20, lastDataPoint.pengunjung + Math.floor(Math.random() * 21) - 10);
        
  //       const nextDay = {
  //           ...lastDataPoint,
  //           pengunjung: newVisitorCount
  //       };

  //       const shiftedData = newData.slice(1);
  //       return [...shiftedData, nextDay];
  //     });
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <motion.div 
      className="bg-card/50 backdrop-blur-md border border-border/20 p-6 rounded-2xl h-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-lg font-bold text-foreground mb-1 flex items-center">
        <Users className="w-5 h-5 mr-2 text-primary" />
        Kunjungan Wisatawan Tahunan
      </h3>
      <p className="text-sm text-muted-foreground mb-6">Data kunjungan wisatawan domestik dari tahun 2020-2024</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 'dataMax + 100']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsla(var(--card), 0.8)',
                backdropFilter: 'blur(4px)',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--primary))' }}
              formatter={(value) => [`${value} ribu`, 'Pengunjung']}
            />
            <Area type="monotone" dataKey="pengunjung" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVisitor)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="hsl(var(--foreground))" className="text-2xl font-bold">
        {`${totalUmkm}+`}
      </text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-sm">
        Total UMKM
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))">{`${payload.name}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))">
        {`(${value} unit, ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const UmkmChart = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback((_, index) => {
        setActiveIndex(index);
    }, [setActiveIndex]);

    return (
        <motion.div 
            className="relative border border-border/20 rounded-2xl h-full overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <img  alt="Produk kerajinan tangan UMKM Desa Wukirsari" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1666578296079-52024f45d962" />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95 backdrop-blur-sm"></div>

            <div className="relative p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-foreground mb-1 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
                  Sebaran UMKM Desa
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Berdasarkan kategori</p>
              <div className="h-64 flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              activeIndex={activeIndex}
                              activeShape={renderActiveShape}
                              data={umkmData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="hsl(var(--primary))"
                              dataKey="value"
                              onMouseEnter={onPieEnter}
                          >
                              {umkmData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                      </PieChart>
                  </ResponsiveContainer>
              </div>
            </div>
        </motion.div>
    );
};

const DashboardSection = () => {
  return (
    <section className="py-20 md:py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VisitorChart />
          <WeatherWidget />
          <div className="lg:col-span-2">
            <UmkmChart />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;