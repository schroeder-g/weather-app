import { renderHook, act } from '@testing-library/react-native';
import { useLocationAutocomplete } from '../useLocationAutocomplete';

global.fetch = jest.fn();

describe('useLocationAutocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useLocationAutocomplete(''));
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and format data based on query', async () => {
    const mockResponse = {
      features: [
        {
          properties: {
            osm_id: 1,
            name: 'Golden Gate',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA'
          }
        }
      ]
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useLocationAutocomplete('Gold'));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      // wait for effect to finish
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe('1');
    expect(result.current.data[0].formattedText).toBe('Golden Gate, San Francisco, CA');
  });
});
