import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { PostEventDbItem, PostsTabKey } from '../../../types/models/post';
import type { PostListSortKey } from '../../../types/models/postSort';
import usePostsMock from './usePostsMock';
import { postManagementApi } from './usePostManagement';
import {
  defaultPostSearchFilters,
  detectTimeSlot,
  type PostSearchFilters,
} from '../utils/postSearchFilters';
import { sortPostsByKey } from '../utils/postSort';

const PAGE_LIMIT = 60;

const usePostsListFilters = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAccountScope = searchParams.get('scope') === 'account';
  const initialTab = searchParams.get('tab');
  const resolvedInitialTab: PostsTabKey =
    initialTab === 'tomorrow' ? 'tomorrow' : initialTab === 'scheduled' ? 'scheduled' : initialTab === 'today' ? 'today' : isAccountScope ? 'scheduled' : 'today';
  const [activeTab, setActiveTab] = useState<PostsTabKey>(resolvedInitialTab);
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<PostListSortKey>('postedAtDesc');
  const [draftFilters, setDraftFilters] = useState<PostSearchFilters>(defaultPostSearchFilters);
  const [appliedFilters, setAppliedFilters] = useState<PostSearchFilters>(defaultPostSearchFilters);

  const params = useMemo(
    () => ({
      tab: activeTab,
      page,
      limit: PAGE_LIMIT,
      sortBy,
      search: appliedFilters.title.trim(),
      categories: appliedFilters.categories,
      prefectures: appliedFilters.prefectures,
      cities: appliedFilters.cities,
      timeSlots: appliedFilters.timeSlots,
    }),
    [activeTab, page, sortBy, appliedFilters],
  );

  const { data, isFetching } = usePostsMock(params);

  const accountLinkedItems = useMemo<PostEventDbItem[]>(() => {
    const query = appliedFilters.title.trim().toLowerCase();

    const mapped = postManagementApi
      .listScheduledPostEventCardsByLocation(postManagementApi.getCurrentLocationId())
      .filter((item) => {
        if (query && !item.title.toLowerCase().includes(query)) {
          return false;
        }

        if (appliedFilters.categories.length > 0 && !appliedFilters.categories.some((category) => item.category.includes(category))) {
          return false;
        }

        if (appliedFilters.cities.length > 0 && !appliedFilters.cities.some((city) => item.ward.includes(city))) {
          return false;
        }

        if (appliedFilters.timeSlots.length > 0 && !appliedFilters.timeSlots.includes(detectTimeSlot(item.timeLabel))) {
          return false;
        }

        return true;
      });

    return sortPostsByKey(mapped, sortBy);
  }, [appliedFilters, sortBy]);

  const accountTotalPages = Math.max(Math.ceil(accountLinkedItems.length / PAGE_LIMIT), 1);
  const accountPage = Math.min(page, accountTotalPages);
  const accountPageItems = useMemo(() => {
    const start = (accountPage - 1) * PAGE_LIMIT;
    return accountLinkedItems.slice(start, start + PAGE_LIMIT);
  }, [accountLinkedItems, accountPage]);

  useEffect(() => {
    const queryTab = searchParams.get('tab');
    if (queryTab === 'today' || queryTab === 'tomorrow' || queryTab === 'scheduled') {
      setActiveTab(queryTab);
      setPage(1);
      return;
    }

    if (isAccountScope) {
      setActiveTab('scheduled');
      setPage(1);
    }
  }, [searchParams, isAccountScope]);

  const displayItems = isAccountScope ? accountPageItems : (data?.items ?? []);
  const totalPages = isAccountScope ? accountTotalPages : (data?.totalPages ?? 1);
  const currentPage = isAccountScope ? accountPage : (data?.page ?? page);

  const handleTabClick = (tabKey: PostsTabKey) => {
    if (tabKey === 'scheduled') {
      navigate('/posts/scheduled');
      return;
    }

    if (isAccountScope) {
      navigate('/posts');
      return;
    }

    navigate(`/posts?tab=${tabKey}`);
  };

  const handleSortChange = (value: PostListSortKey) => {
    setSortBy(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setDraftFilters({ ...defaultPostSearchFilters });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...draftFilters });
    setPage(1);
    setSearchOpen(false);
  };

  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () => setPage((prev) => Math.min(totalPages, prev + 1));

  return {
    isAccountScope,
    activeTab,
    page,
    searchOpen,
    setSearchOpen,
    sortBy,
    draftFilters,
    setDraftFilters,
    isFetching,
    displayItems,
    totalPages,
    currentPage,
    handleTabClick,
    handleSortChange,
    handleClearFilters,
    handleApplyFilters,
    handlePrevPage,
    handleNextPage,
  };
};

export default usePostsListFilters;
