import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Step 1: Fetch weather data
const fetchWeatherData = createStep({
  id: 'fetch-weather-data',
  description: 'Fetches weather data for a city',
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    condition: z.string(),
    city: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    // Simulate weather API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      temperature: Math.floor(Math.random() * 30) + 10, // Random temp 10-40°C
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      city: inputData.city,
    };
  },
});

// Step 2: Calculate travel time
const calculateTravelTime = createStep({
  id: 'calculate-travel-time',
  description: 'Calculates travel time to a city',
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    travelTime: z.number(),
    distance: z.number(),
    city: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    // Simulate travel calculation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      travelTime: Math.floor(Math.random() * 8) + 1, // Random 1-8 hours
      distance: Math.floor(Math.random() * 500) + 50, // Random 50-550 km
      city: inputData.city,
    };
  },
});

// Step 3: Get local events
const getLocalEvents = createStep({
  id: 'get-local-events',
  description: 'Gets local events for a city',
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    events: z.array(z.string()),
    city: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    // Simulate events API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const eventTypes = ['Concert', 'Festival', 'Market', 'Exhibition', 'Sports Game'];
    const events = Array.from({ length: 3 }, () => 
      eventTypes[Math.floor(Math.random() * eventTypes.length)]
    );
    
    return {
      events,
      city: inputData.city,
    };
  },
});

// Step 4: Combine all data
const combineData = createStep({
  id: 'combine-data',
  description: 'Combines weather, travel, and events data',
  inputSchema: z.object({
    weather: z.object({
      temperature: z.number(),
      condition: z.string(),
      city: z.string(),
    }),
    travel: z.object({
      travelTime: z.number(),
      distance: z.number(),
      city: z.string(),
    }),
    events: z.object({
      events: z.array(z.string()),
      city: z.string(),
    }),
  }),
  outputSchema: z.object({
    recommendation: z.string(),
    summary: z.object({
      city: z.string(),
      weather: z.string(),
      travelInfo: z.string(),
      events: z.array(z.string()),
    }),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { weather, travel, events } = inputData;
    
    let recommendation = '';
    
    if (weather.condition === 'sunny' && travel.travelTime <= 4) {
      recommendation = `Perfect day trip! ${weather.city} has sunny weather and is only ${travel.travelTime} hours away.`;
    } else if (weather.condition === 'rainy') {
      recommendation = `Consider indoor activities in ${weather.city}. It's rainy but there are ${events.events.length} events happening.`;
    } else {
      recommendation = `${weather.city} is ${travel.travelTime} hours away with ${weather.condition} weather. Plan accordingly!`;
    }
    
    return {
      recommendation,
      summary: {
        city: weather.city,
        weather: `${weather.temperature}°C, ${weather.condition}`,
        travelInfo: `${travel.distance}km, ${travel.travelTime}h drive`,
        events: events.events,
      },
    };
  },
});

// Create a simple workflow that just fetches weather data
const parallelWorkflow = createWorkflow({
  id: 'parallel-workflow',
  inputSchema: z.object({
    city: z.string().describe('The city to get information about'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    condition: z.string(),
    city: z.string(),
  }),
})
  .then(fetchWeatherData);

parallelWorkflow.commit();

export { parallelWorkflow }; 