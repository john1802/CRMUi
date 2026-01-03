import { useState, useEffect, useCallback } from 'react';
import { Entity } from '../types/entity';
import { Field } from '../types/field';
import { EntityApi } from '../api/entityApi';
import { FieldApi } from '../api/fieldApi';

interface FetchDefinitionState {
  entity: Entity | null;
  fields: Field[];
  isLoading: boolean;
  error: string | null;
}

export const useFetchDefinition = (entityId: string | undefined) => {
  const [state, setState] = useState<FetchDefinitionState>({
    entity: null,
    fields: [],
    isLoading: false,
    error: null,
  });

  const fetchDefinition = useCallback(async () => {
    if (!entityId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [entityResponse, fieldsResponse] = await Promise.all([
        EntityApi.getById(entityId),
        FieldApi.getByEntity(entityId),
      ]);

      setState({
        entity: entityResponse.data,
        fields: fieldsResponse.data.sort((a, b) => a.order - b.order),
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch entity definition';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, [entityId]);

  useEffect(() => {
    fetchDefinition();
  }, [fetchDefinition]);

  return {
    ...state,
    refetch: fetchDefinition,
  };
};
