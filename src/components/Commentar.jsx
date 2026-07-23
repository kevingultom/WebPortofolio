import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';
import { useLanguage } from '../context/LanguageContext';


const Comment = memo(({ comment, formatDate, index, isPinned = false }) => {
    const { t } = useLanguage();
    return (
    <div
        className={`px-4 pt-4 pb-2 rounded-xl border transition-colors group ${
            isPinned
                ? 'bg-white/10 border-white/25 hover:bg-white/[0.14]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-white">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{t.comments.pinned}</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            {comment.profile_image ? (
                <img
                    src={comment.profile_image}
                    alt={`${comment.user_name}'s profile`}
                    className={`w-10 h-10 rounded-full object-cover border-2 flex-shrink-0  ${
                        isPinned ? 'border-white/50' : 'border-white/30'
                    }`}
                    loading="lazy"
                />
            ) : (
                <div className={`p-2 rounded-full text-white group-hover:bg-white/30 transition-colors ${
                    isPinned ? 'bg-white/30' : 'bg-white/20'
                }`}>
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium truncate ${
                            isPinned ? 'text-white' : 'text-white'
                        }`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
    );
});

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const { t } = useLanguage();
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert(t.comments.fileTooLarge);
                // Reset the input
                if (e.target) e.target.value = '';
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert(t.comments.invalidFileType);
                if (e.target) e.target.value = '';
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, [t]);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    {t.comments.nameLabel} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                     maxLength={15}
                    placeholder={t.comments.namePlaceholder}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    {t.comments.messageLabel} <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                     maxLength={200}

                    onChange={handleTextareaChange}
                    placeholder={t.comments.messagePlaceholder}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    {t.comments.photoLabel} <span className="text-gray-400">{t.comments.photoOptional}</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>{t.comments.removePhoto}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-dashed border-white/40 hover:border-white/70 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>{t.comments.choosePhoto}</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                {t.comments.maxFileSize}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-white text-black rounded-xl font-medium overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:bg-gray-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-black/10 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t.comments.posting}</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>{t.comments.post}</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const { t } = useLanguage();
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: true,
            duration: 1000,
        });
    }, []);

    // Fetch pinned comment
    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .single();
                
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching pinned comment:', error);
                    return;
                }
                
                if (data) {
                    setPinnedComment(data);
                }
            } catch (error) {
                console.error('Error fetching pinned comment:', error);
            }
        };

        fetchPinnedComment();
    }, []);

    // Fetch regular comments (excluding pinned) and set up real-time subscription
    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching comments:', error);
                return;
            }
            
            setComments(data || []);
        };

        fetchComments();

        // Set up real-time subscription
        const subscription = supabase
            .channel('portfolio_comments')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'portfolio_comments',
                    filter: 'is_pinned=eq.false'
                }, 
                () => {
                    fetchComments(); // Refresh comments when changes occur
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('profile-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        
        try {
            const profileImageUrl = await uploadImage(imageFile);
            
            const { error } = await supabase
                .from('portfolio_comments')
                .insert([
                    {
                        content: newComment,
                        user_name: userName,
                        profile_image: profileImageUrl,
                        is_pinned: false,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                throw error;
            }
        } catch (error) {
            setError(t.comments.postError);
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage, t]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return t.comments.justNow;
        if (diffMinutes < 60) return `${diffMinutes}${t.comments.minutesAgo}`;
        if (diffHours < 24) return `${diffHours}${t.comments.hoursAgo}`;
        if (diffDays < 7) return `${diffDays}${t.comments.daysAgo}`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, [t]);

    // Calculate total comments (pinned + regular)
    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl">
            <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10">
                        <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                        {t.comments.title} <span className="text-white/60">({totalComments})</span>
                    </h3>
                </div>
            </div>
            <div className="p-6 space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="space-y-4 h-[328px] overflow-y-auto overflow-x-hidden custom-scrollbar pt-1 pr-1 " data-aos="fade-up" data-aos-delay="200">
                    {/* Pinned Comment */}
                    {pinnedComment && (
                        <div data-aos="fade-down" data-aos-duration="800">
                            <Comment 
                                comment={pinnedComment} 
                                formatDate={formatDate}
                                index={0}
                                isPinned={true}
                            />
                        </div>
                    )}
                    
                    {/* Regular Comments */}
                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="w-12 h-12 text-white mx-auto mb-3 opacity-50" />
                            <p className="text-gray-400">{t.comments.empty}</p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <Comment 
                                key={comment.id} 
                                comment={comment} 
                                formatDate={formatDate}
                                index={index + (pinnedComment ? 1 : 0)}
                                isPinned={false}
                            />
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
            `}</style>
        </div>
    );
};

export default Komentar;